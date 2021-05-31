'use strict'
class DevJauge {

/**
	* Règle la jauge de développement dans +owner+
	*
	* Pour fonctionner, le +owner+ doit impérativement :
	* - répondre à 'obj', qui est son objet DOM principal
	* - répondre à 'tasks' qui retourne les IDs des tâches
	* - posséder dans son obj une balise <devjauge>
	*/
static setIn(owner){
	let devjauge
	try {
		owner.obj || raise("Le propriétaire doit répondre à 'obj' qui doit retourner son objet DOM")
		owner.tasks || raise("Le propriétaire doit répondre à 'tasks', qui doit retourner les IDs de ses tâches")
		devjauge = owner.obj.querySelector('devjauge')
		devjauge || raise("Le propriétaire doit posséder une balise <devjauge> pour sa jauge")
	} catch(err) {console.error(err);return erreur(err)}
	
	let spandone = devjauge.querySelector('span.done')
	if ( undefined == spandone){
		spandone = document.createElement('SPAN')
		spandone.classList.add('done')
		devjauge.appendChild(spandone)
	}
	const taskCount = owner.tasks.length
	let ratio
	if ( taskCount ) {
		devjauge.classList.remove('hidden')
		const maxW = devjauge.offsetWidth
		// console.log("Largeur : ", maxW)
		var taskDone = 0
		// Il faut voir combien de tâches sont faites
		owner.tasks.forEach(task => {
			if ('object' != typeof(task)) task = CheckListTask.get(task)
			if ( task.checked ) ++ taskDone
		})
		// console.log("Nombre de tâches : %i, Nombre de tâches faites : %i", taskCount, taskDone)
		ratio = parseInt(100 / (taskCount / taskDone), 10)	
	} else {
		devjauge.classList.add('hidden')
		ratio = 0
	}
	// console.log("Ratio = ", ratio)
	spandone.style.width = `${ratio}%`
}


}// class DevJauge