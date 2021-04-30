# A C.R.E.A.M client library

![libcream test](https://github.com/kazuakiishiguro/libcream/workflows/libcream%20test/badge.svg?branch=master)

This repository contains an essential libraries for [C.R.E.A.M](https://github.com/couger-inc/cream)'s client application.

## Install

```bash
$ yarn add libcream
# or
$ npm install libcream
```

## Test
```bash
$ yarn test
#or
$ npm run test
```

## Usability

### Deposit
Basically, the libcream library is intended to be used in conjunction with other zero-knowledge proof protocol frameworks.

```javascript
import { MerkleTree } from 'cream-merkle-tree'
import { createDeposit, rbigInt } from 'libcream'

const len = 31
const levels = 4
const zero_value = 0

const tree = new MerkleTree(
	levels,
	zero_value
)

// Create deposit
const deposit = createDeposit(rbigInt(len), rbigInt(len))
const { commitment, nullifierHash, nullifier, secret } = deposit

// Update merkleTree
tree.insert(commitment)
```

### Generate MerkleTree when sign up MACI
All you need is to pass `deposit: Deposit`, target `contract: ethers.Contract` and `p: MerkleTreeParams`

```javascript
const deposit = generateDeposit(rbigInt(31), rbigInt(31))

const params = {
	depth: 4,
	zeroValue: "2558267815324835836571784235309882327407732303445109280607932348234378166811"
}

const { root, merkleProof } = await generateMerkleProof(deposit, contract, params)
```

### Create message for casting your vote
In order to use in partnership with MACI, you need to cast a message. Here is a simple use case

```javascript
import { createMessage } from 'libcream'

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

console.log(message)

// Message {
//      asArray: [Function],
//      asContractParam: [Function],
//      asCircuitInputs: [Function],
//      hash: [Function],
//      copy: [Function],
//      iv: 185273743003989823918834017806979612739987020163142754605482722745160024803n,
//      data: [
//        12311909440282622154219983755552473244443894343591985567303227809516726503449n,
//        42729577740623276802940420404626285991521762172891067540023340839538206556899n,
//        12610050538445939413855066192801673022935035326976616644124715813192497313341n,
//        12721333521477588815865816033592770062962879825348546385071187996127267268651n,
//        6774715088538722956319688583602539994620352354964895156724986989935524816617n,
//        20907541856021682955741733730679929080263888556819984677346342338990513027077n,
//        23056247447894948214297584481553505239441791580133357164033722194508283028929n,
//        10135344687454730375787319542162517559656950295372471064854032077012631951921n,
//        33299670189126249157947569076192296241539085983903696063229178041352348127066n,
//        13903745421168434070568805183640706209745444163891865058811159780729482213771n
//      ]
//}
```
