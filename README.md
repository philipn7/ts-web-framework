# Web Framework From Scratch
A web framework built from scratch using TypeScript. Features such as event listeners, saving and fetching user data to a JSON Server.

## Event Listener
Implemented for typical events found in the browser such as 'click', 'hover', 'mouseover'. So, we need to create an object that will store the events along with their callbacks. This can be visualized like this:

![](images/Pasted%20image%2020211019110417.png)

When the event is triggered, we call each function in the array.

`events: {[key: string]: Callback[] } = {};`

Note the key for each callback array is `[key: string]`. This is because we do not know the name of the different events yet. This tells TypeScript that the property will be a string that points to a Callback[] object.

## Save and Fetch to Backend
Axios is used to make network requests to JSON Server.

### JSON Server setup
`npm intall -g json-server`
JSON Server needs to have a json file to begin initializaions. 'db.json' is a file created with an object with the key: "users".
```
{
  "users": []
}
```
JSON server will serve up a resource called 'users' and will create routes automatically.

`json-server -w db.json`

### Fetch and Save
Rely on axios to do RESTful operations with the server just set up.
```
fetch(): void {
    axios
      .get(`http://localhost:3000/users/${this.get('id')}`)
      .then((response: AxiosResponse): void => {
        this.set(response.data);
      });
  }
```
Get the information on this user from the JSON Server and update this current object with it.

Save uses POST for new objects or PUT to update existing objects.


## Refactor 1
Now that the major functions of the User class is implemented it's a good time to refactor. The event listener methods and properties can be easily extracted into a new class. Now, how do we re-integrate the event listener back into the User class? Three different approaches:

1) Accept dependencies (event listener class) **as a second argument in the constructor**. 
`constructor( private data: UserProps, private events: Eventing) {}` But creating a new User now requires us to pass in the event listener object. 
`new User({ id: 1}, new Eventing());` Will get cumbersome.
2) Only accept dependencies into constructor & **define a static class method to preconfigure** User class and properties. 
`constructor(private events: Eventing)` and static method `static fromData(data: UserProps): User { const user = new User(new Eventing()) }`. 
To create a new User we use the static method `new User.fromData({ id: 1 })`. 
Better, but some new combination of child classes will require different static methods.
3) Only accept properties into constructor & **hard code dependencies** as class properties. `events: Eventing = new Eventing();` Lose some flexibility of composition, but in this case the event listener probably doesn't have other implementations.

