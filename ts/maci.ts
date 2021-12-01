import { BigNumber } from '@ethersproject/bignumber'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PubKey, Command, Message } from 'maci-domainobjs'

// Ported from clr.fund utils
// https://github.com/clrfund/monorepo/blob/fa2154cc54/contracts/utils/maci.ts
const createMessage = (
	userStateIndex: number,
	userKeypair: Keypair,
	newUserKeypair: Keypair | null,
	coordinatorPubKey: PubKey,
	voteOptionIndex: number | null, // index of recipinets[]
	voiceCredits: number | null,
	pollId: number,
	nonce: number,
	_salt?: BigInt
): [Message, PubKey] => {
	const encKeypair = new Keypair()
	const salt = _salt ? _salt : genRandomSalt()
	const quadraticVoteWeight = voiceCredits
		? bnSqrt(BigNumber.from(voiceCredits)).toBigInt()
		: BigInt(0)
	const command = new Command(
		BigInt(userStateIndex),
		newUserKeypair ? newUserKeypair.pubKey : userKeypair.pubKey,
		BigInt(voteOptionIndex || 0),
		quadraticVoteWeight,
		BigInt(nonce),
		BigInt(pollId),
		salt
	)
	const signature = command.sign(userKeypair.privKey)
	const message = command.encrypt(
		signature,
		Keypair.genEcdhSharedKey(encKeypair.privKey, coordinatorPubKey)
	)
	return [message, encKeypair.pubKey]
}

const bnSqrt = (a: BigNumber): BigNumber => {
	// Take square root from a big number
	// https://stackoverflow.com/a/52468569/1868395
	if (a.isZero()) {
		return a
	}
	let x
	let x1 = a.div(2)
	do {
		x = x1
		x1 = x.add(a.div(x)).div(2)
	} while (!x.eq(x1))
	return x
}

export { createMessage, bnSqrt }
