import * as crypto from 'crypto'
import axios from 'axios'
import { SnarkBigInt, bigInt, MerkleTree } from 'cream-merkle-tree'
import { babyJub, pedersenHash as circomPedersenHash } from 'circomlib'
import { createMessage, bnSqrt } from './maci'

interface PedersenHash {
	babyJubX: SnarkBigInt
	babyJubY: SnarkBigInt
}

interface Deposit {
	nullifier: SnarkBigInt
	secret: SnarkBigInt
	preimage: SnarkBigInt
	commitment: SnarkBigInt
	nullifierHash: SnarkBigInt
}

interface MerkleTreeParams {
	depth: number
	zero_value: SnarkBigInt
}

interface MerkleProof {
	root: SnarkBigInt
	merkleProof: [SnarkBigInt[], number[]]
}

const toHex = (n: SnarkBigInt, length = 32): string => {
	const str = n instanceof Buffer ? n.toString('hex') : bigInt(n).toString(16)
	return '0x' + str.padStart(length * 2, '0')
}

const pedersenHash = (value: SnarkBigInt): PedersenHash => {
	const hashed = circomPedersenHash.hash(value)
	const result = babyJub.unpackPoint(hashed)

	return {
		babyJubX: result[0],
		babyJubY: result[1],
	}
}

const rbigInt = (nbytes: number): SnarkBigInt => {
	return bigInt.leBuff2int(crypto.randomBytes(nbytes))
}

const createDeposit = (
	nullifier: SnarkBigInt,
	secret: SnarkBigInt
): Deposit => {
	const preimage = Buffer.concat([
		nullifier.leInt2Buff(31),
		secret.leInt2Buff(31),
	])
	const commitment = pedersenHash(preimage)
	const nullifierHash = pedersenHash(nullifier.leInt2Buff(31))

	return {
		nullifier,
		secret,
		preimage,
		commitment: commitment.babyJubX,
		nullifierHash: nullifierHash.babyJubX,
	}
}

const generateDeposit = (note: string): Deposit => {
	const buf: Buffer = Buffer.from(note.slice(2), 'hex')
	return createDeposit(
		bigInt.leBuff2int(buf.slice(0, 31)),
		bigInt.leBuff2int(buf.slice(31, 62))
	)
}

// eventArray[] = [commitment, leafIndex, timastamp]
const generateMerkleProof = async (
	deposit: Deposit,
	address: string,
	p: MerkleTreeParams,
	token: string,
	host: string = 'http://localhost:3000'
): Promise<MerkleProof> => {
	const tree = new MerkleTree(p.depth, p.zero_value)

	const authorization = token ? `Bearer ${token}` : ''
	const r = await axios.get(host + '/zkcream/deposit/logs/' + address, {
		headers: { authorization },
	})
	const events = r.data

	const depositEvent = events.find((e) => e[0] === toHex(deposit.commitment))

	const leafIndex = depositEvent ? depositEvent[1] : -1
	if (leafIndex < 0) {
		process.exit(1)
	}

	const leaves = events.sort((a, b) => a[1] - b[1]).map((e) => e[0])

	if (leaves) {
		for (let i = 0; i < leaves.length; i++) {
			tree.insert(leaves[i])
		}
	}

	const root = tree.root
	const merkleProof = tree.getPathUpdate(leafIndex)

	return {
		root,
		merkleProof,
	}
}

export {
	SnarkBigInt,
	bigInt,
	toHex,
	pedersenHash,
	rbigInt,
	createDeposit,
	generateDeposit,
	createMessage,
	bnSqrt,
	generateMerkleProof,
}
