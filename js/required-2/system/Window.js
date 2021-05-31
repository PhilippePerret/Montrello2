'use strict'
/**
	* Class Window
	* -------------
	* Pour gérer la fenêtre
	*
	*/

class Window {
static get right(){return this.width}
static get bottom(){return this.height}
static get width(){return window.innerWidth}
static get height(){return window.innerHeight}
}