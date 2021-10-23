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


# Refactor 1
Now that the major functions of the User class is implemented it's a good time to refactor. 

## Refactor event listener
The event listener methods and properties can be easily extracted into a new class. Now, how do we re-integrate the event listener back into the User class? Three different approaches:

1) Accept dependencies (event listener class) **as a second argument in the constructor**. 
`constructor( private data: UserProps, private events: Eventing) {}` But creating a new User now requires us to pass in the event listener object. 
`new User({ id: 1}, new Eventing());` Will get cumbersome.
2) Only accept dependencies into constructor & **define a static class method to preconfigure** User class and properties. 
`constructor(private events: Eventing)` and static method `static fromData(data: UserProps): User { const user = new User(new Eventing()) }`. 
To create a new User we use the static method `new User.fromData({ id: 1 })`. 
Better, but some new combination of child classes will require different static methods.
3) Only accept properties into constructor & **hard code dependencies** as class properties. `events: Eventing = new Eventing();` Lose some flexibility of composition, but in this case the event listener probably doesn't have other implementations.

## Refactor Sync (fetch and save)
The fetch and save methods are highly dependent on references to the User object (this.get, this.set, this.data). There are many approaches, including just accepting these reference types in Sync, but the better one is to use Generics.

![](images/Pasted%20image%2020211021190341.png)

**One take away it that we can refactor in steps instead of jumping straight into generics.**
Step 1 would be to refactor the methods in Sync to take in arguments. Currently they don't take arguments. Could be helpful to change what is delegated to this class. For example, fetch() only returns an AxiosPromise. The responsibility is now on the parent class use it.

Step 2 is to refactor the specific arguments into Generics. This is a great time to use Generic Constraints to tell TypeScript the properties it can expect in the Generic. We create an interface and use a Generic constraint: `<T extends HasId>`

## Refactor Attributes
This class will be generic as well. However, the get() method returns a type that is dependent on whatever type we set as T. To return the correct type we make use of Generic Constraints on *methods*.

```
get(propName: string): number | string {
    return this.data[propName];
  }
```
```
get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
```

`<K extends keyof T>` is the generic constraint that defines K as the key values in our interface definition. (All key values in JavaScript are strings.)
`T[K]` gives us the type of the value in the key/value pair from the interface.

# Using the Extracted Classes
How do we use the classes now that they're extracted out? We could call the methods directly so that `user.set()` now becomes `user.attributes.set()`. This will get messy quick.

We can take advantage of Accessors. Previously, we used `get name()` to turn calling a method `foo.name()` to property `foo.name`. Likewise, we can return functions instead.
```
  get get() {
    return this.attributes.get;
  }
```
In this example, the method 'get' is passed through the parent class. Note '()' is missing at the end of `this.attributs.get`.

This can be shortened to:
`get = this.attributes.get;`
Equivalent to above as long as the subclass is initialized inside the constructor parameters. This ensures that the line executes *after* the subclass is initialized.

However, when using `User.get()` we get an error that the property we are looking for doesn't exist. The issue it that `this` in the get method no longer resolves to the object we intended. The two ways it can be fixed is to either bound `this` by using the arrow function notation on `get()` in the Attributes class. Or, use binding in our accessor method.

**The whole point is to have those methods 'pass through' directly to the parent class.**

