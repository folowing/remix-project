import { Block } from '@tvmjs/block'
import { BN } from '@tvmjs/util'

export function generateBlock (vmContext) {
  return new Promise((resolve, reject) => {
    const block: Block = Block.fromBlockData({
      header: {
        timestamp: (new Date().getTime() / 1000 | 0),
        number: 0,
        coinbase: '0x0e9281e9c6a0808672eaba6bd1220e144c9bb07a',
        gasLimit: new BN('8000000').imuln(1)
      }
    }, { common: vmContext.vmObject().common })

    vmContext.vm().runBlock({ block: block, generate: true, skipBlockValidation: true, skipBalance: false }).then(() => {
      vmContext.addBlock(block)
      resolve({})
    }).catch((e) => reject(e))
  })
}
