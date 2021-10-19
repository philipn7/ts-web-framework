import { User } from './models/User';

const user = new User({ name: 'phil', age: 35 });

user.set({ name: 'derp' });

console.log(user.get('name'));
console.log(user.get('age'));

user.on('click', () => {});

console.log(user);
