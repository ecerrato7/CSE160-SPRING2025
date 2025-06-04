const controlsList = [
  { key: 'Click', action: 'Move cat to clicked spot' },
  { key: 'T', action: 'Disable the lock camera on cat' },
  { key: 'P', action: 'Pause/Resume cat walk animation' },
  { key: 'I', action: 'Increase cat walk speed' },
  { key: 'O', action: 'Decrease cat walk speed' },

  { key: 'Scroll', action: 'Zoom camera' }
];

function logControls() {
console.log('Imported the cat.obj from the free website  and made the bones in blender as well as the animation when it moves. Wouldve created more animations but ran out of time.');
console.log('Story: Your a stray cat wander in the day. Its spooky out there find the wooden box that has food. ');
  console.log('--- Controls ---');
 
  controlsList.forEach(ctrl => {
    console.log(`${ctrl.key}: ${ctrl.action}`);
  });
}

export { controlsList, logControls };