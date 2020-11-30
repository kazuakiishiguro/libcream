import { BigNumber } from 'ethers'
import { createMessage, bnSqrt } from '../maci'

describe('maci utilities implementation', () => {
  it('bnSqrt', () => {
    expect(bnSqrt(BigNumber.from(9))).toEqual(BigNumber.from(3))
    expect(bnSqrt(BigNumber.from(16))).toEqual(BigNumber.from(4))    
    expect(bnSqrt(BigNumber.from(25))).toEqual(BigNumber.from(5))
  })
})
