import * as crypto from 'crypto'
import { SnarkBigInt, bigInt } from 'cream-merkle-tree'
import { babyJub, pedersenHash as circomPedersenHash } from 'circomlib'

interface PedersenHash {
    babyJubX: SnarkBigInt,
    babyJubY: SnarkBigInt
}

interface Deposit {
    nullifier: SnarkBigInt,
    secret: SnarkBigInt,
    preimage: SnarkBigInt,
    commitment: SnarkBigInt,
    nullifierHash: SnarkBigInt
}

const toHex = (
    n: SnarkBigInt,
    length = 32
): string => {
    const str = n instanceof Buffer ? n.toString('hex') : bigInt(n).toString(16)
    return '0x' + str.padStart(length * 2, '0')
}

const pedersenHash = (
    value: SnarkBigInt
): PedersenHash => {
    const hashed = circomPedersenHash.hash(value)
    const result = babyJub.unpackPoint(hashed)

    return {
        babyJubX: result[0],
        babyJubY: result[1]
    }
}

const rbigInt = (
    nbytes: number
): SnarkBigInt => {
    return bigInt.leBuff2int(crypto.randomBytes(nbytes))
}

const createDeposit = (
    nullifier: SnarkBigInt,
    secret: SnarkBigInt
): Deposit => {
    const preimage = Buffer.concat([nullifier.leInt2Buff(31), secret.leInt2Buff(31)])
    const commitment = pedersenHash(preimage)
    const nullifierHash = pedersenHash(nullifier.leInt2Buff(31))

    return {
        nullifier,
        secret,
        preimage,
        commitment: commitment.babyJubX,
        nullifierHash: nullifierHash.babyJubX
    }
}

const generateDeposit = (
    note: string
): Deposit => {
    const buf: Buffer = Buffer.from(note.slice(2), 'hex')
    return createDeposit(
        bigInt.leBuff2int(buf.slice(0, 31)),
        bigInt.leBuff2int(buf.slice(31, 62))
    )
}

export {
    SnarkBigInt,
    bigInt,
    toHex,
    pedersenHash,
    rbigInt,
    createDeposit,
    generateDeposit
}
