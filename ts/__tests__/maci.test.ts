import { BigNumber } from 'ethers'
import { Keypair } from 'maci-domainobjs'
import { createMessage, bnSqrt } from '../maci'

describe('maci utilities implementation', () => {
  it('bnSqrt()', () => {
    expect(bnSqrt(BigNumber.from(9))).toEqual(BigNumber.from(3))
    expect(bnSqrt(BigNumber.from(16))).toEqual(BigNumber.from(4))    
    expect(bnSqrt(BigNumber.from(25))).toEqual(BigNumber.from(5))
  })
  it('createMessage() will produce different message iv and encKeyPair', () => {
    const userStateIndex = 1
    const userKeypair = new Keypair()
    const coordinatorPubKey = new Keypair().pubKey
    const recipientIndex = 1
    const nonce = 1
    
    const [message, encKeyPair] = createMessage(
      userStateIndex,
      userKeypair,
      null,
      coordinatorPubKey,
      recipientIndex,
      null,
      nonce
    )

    const [message1, encKeyPair1] = createMessage(
      userStateIndex,
      userKeypair,
      null,
      coordinatorPubKey,
      recipientIndex,
      null,
      nonce
    )

    expect(message.iv).not.toEqual(message1.iv)
    expect(encKeyPair).not.toEqual(encKeyPair1)    
  })
})
