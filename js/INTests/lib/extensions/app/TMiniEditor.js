'use strict'
class TMiniEditor {

/**
 * Méthodes publiques
 * 
 */
static setText(str){
  this.textField.value = str
}
static setTextarea(str){
  this.textarea.value = str
}
static clickSave(){
  this.btnSave.click()
}
static Cancel(){
  this.btnCancel.click()
}


static get textField(){
  return this._tf || (this._tf = DGet('#minieditor-text-field',this.obj))
}
static get textarea(){
  return this._ta || (this._ta = DGet('#minieditor-textarea',this.obj))
}
static get btnSave(){
  return this._btnsave || (this._btnsave = DGet('#minieditor-btn-save',this.obj))
}
static get btnCancel(){
  return this._btncanc || (this._btncanc = DGet('#minieditor-btn-cancel',this.obj))
}
static get obj(){
  return this._obj || (this._obj = DGet('minieditor'))
}

}// class TMiniEditor