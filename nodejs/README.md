#  Basic Informational Site - Task1 

## Assignment

Make a project directory and create the following files inside that directory:

- `index.html`
- `about.html`
- `contact-me.html`
- `404.html`

Create your Node.js server file `index.js` and add the code needed to serve the right page according to the URL.

- `localhost:8080` should take users to `index.html`
- `localhost:8080/about` should take users to `about.html`
- `localhost:8080/contact-me` should take users to `contact-me.html`
- `404.html` should display any time the user tries to go to a page not listed above.



## Implementation

This Assignment was implemented using two approaches:

1. **Using `http`:**
   - Created a basic HTTP server using Node.js built-in `http` module.

2. **Using `Express`:**
   - Built a server using the Express framework for simplified route handling.
   