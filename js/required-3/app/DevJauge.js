'use strict'
/*

	Class DevJauge
	--------------
	Elle s'occupe de gérer les jauge de développement qui indiquent
	l'état d'avancée des tâches (CheckListTask) dans une CheckList.

	Elle peut être appelée soit par la construction de la carte (au
	démarrage par exemple) soit lors de l'édition de la carte, depuis
	le formulaire d'édition de la carte (CarteForm).

	Elle fonctionne avec une balise <devjauge> contenant une balise
	span.done qui est développé au pourcentage des tâches accomplies.

*/
class DevJauge {

/**
	* Règle la jauge de développement dans +owner+
	* 
	* Elle s'occupe aussi de l'afficher ou de la masquer si l'owner 
	* possède ou non des tâches.
	*
	* +owner+
	* 	Peut être soit la carte, soit le formulaire de carte
	* 	Si c'est le formulaire de carte, deux jauges sont à 
	* 	actualiser.
	*/
static setIn(owner){
	// console.log("-> DevJauge#setIn(owner=)", owner)
	// +owner+ est toujours une checklist pour le moment
	// On obtient sa carte par owner.parent
	let devjauge, spandone, devjauge2, spandone2 ;
	try {
		owner 		|| raise("DevJauge::setInt doit recevoir le propriétaire en premier argument. Rien n'a été reçu.")
		owner.obj || raise("Le propriétaire doit répondre à 'obj' qui doit retourner son objet DOM")
		devjauge = DGet('devjauge', owner.obj)
		devjauge 	|| raise("Le propriétaire doit posséder une balise <devjauge> pour sa jauge")
	} catch(err) {
		console.error(err);return erreur(err)
	}

	/**
	 * Le span pour indiquer la proportion accomplie
	 */
	spandone 	= devjauge.querySelector('span.done') || this.createSpanDoneFor(devjauge)
	
	let tasks ;
	// La seconde jauge est la jauge de la carte
	if ( owner instanceof CheckList ) {
		devjauge2 = owner.parent.devjaugeElement
		spandone2 = devjauge2.querySelector('span.done') 	|| this.createSpanDoneFor(devjauge2)
		tasks = owner.children
	} else {
		// Quand le propriétaire est une carte
		tasks = owner.tasks
	}	
	// console.log("tasks = ", tasks)

	const taskCount = tasks.length
	var taskDone = 0
	taskCount && tasks.forEach(task => task.checked && (++ taskDone))
	this.setJauge(devjauge, spandone, taskCount, taskDone)
	devjauge2 && this.setJauge(devjauge2, spandone2, taskCount, taskDone)
	// console.log("Ratio = ", ratio)
}

static setJauge(jauge, spandone, nombreTask, nombreDone){
	let ratio = parseInt(100 / (nombreTask / nombreDone), 10)	
	if ( nombreTask ) {
		jauge.classList.remove('hidden')
	} else {
		jauge.classList.add('hidden')
		ratio = 0
	}
	spandone.style.width = `${ratio}%`
}

static createSpanDoneFor(jauge){
	const span = DCreate('SPAN',{class:'done'})
	jauge.appendChild(span)
	return span
}


}// class DevJauge