# Web Framework From Scratch
A web framework built from scratch using TypeScript. Features such as event listeners, 

## Event Listener
Implemented for typical events found in the browser such as 'click', 'hover', 'mouseover'. So, we need to create an object that will store the events along with their callbacks. This can be visualized like this:

![](images/Pasted%20image%2020211019110417.png)

When the event is triggered, we call each function in the array.

`events: {[key: string]: Callback[] } = {};`

Note the key for each callback array is `[key: string]`. This is because we do not know the name of the different events yet. This tells TypeScript that the property will be a string that points to a Callback[] object.