import {
    createDeposit,
    pedersenHash,
    hashOne,
    hashLeftRight,
    rbigInt,
    bigInt,
} from '../'

// prime number for babyjubjub ec
const SNARK_FIELD_SIZE = bigInt(
    '21888242871839275222246405745257275088548364400416034343698204186575808495617'
)

describe('creamlib utilities', () => {
    describe('hashing', () => {
        it('the hash size of random number should be smaller than the snark field size', () => {
            const h_one = hashOne(rbigInt(Math.floor(Math.random() * 1000)))
            expect(h_one.lt(SNARK_FIELD_SIZE)).toBeTruthy()

            const h_lr = hashLeftRight(rbigInt(Math.floor(Math.random() * 1000)), rbigInt(Math.floor(Math.random() * 1000)))
            expect(h_lr.lt(SNARK_FIELD_SIZE)).toBeTruthy()
        })
    })

    describe('Deposit object creation', () => {
        it('should return `Depost` object correctly', () => {
            const nullifier = rbigInt(31)
            const nullifier_buf = nullifier.leInt2Buff(31)
            const secret = rbigInt(31)
            const preimage = Buffer.concat([nullifier_buf, secret.leInt2Buff(31)])

            const deposit = createDeposit(nullifier, secret)

            expect(deposit.commitment.toString()).toEqual(pedersenHash(preimage).babyJubX.toString())
            expect(deposit.nullifierHash.toString()).toEqual(pedersenHash(nullifier_buf).babyJubX.toString())
        })
    })
})
