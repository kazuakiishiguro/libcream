import {
    createDeposit,
    pedersenHash,
    rbigInt,
    bigInt,
} from '../'

describe('creamlib utilities', () => {
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
