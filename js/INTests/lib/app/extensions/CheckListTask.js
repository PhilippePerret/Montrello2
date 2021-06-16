'use strict'

Object.assign(CheckListTask, {
  count_on_disk: async function(){
    const ret = await Ajax.send('count.rb', {type: 'tk'})
    return ret.count
  }
})