import * as snarkjs from 'snarkjs'
import * as crypto from 'crypto'
import { babyJub, mimcsponge, pedersenHash as circomPedersenHash } from 'circomlib'

type SnarkBigInt = snarkjs.bigInt

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

const bigInt = snarkjs.bigInt

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
        nullifierHash: nullifierHash.babyJubY
    }
}

export {
    //    MerkleTree,
    SnarkBigInt,
    bigInt,
    pedersenHash,
    rbigInt,
    createDeposit,
}
