# Getting started

1. `yarn install or npm install or pnpm install` to install dependency
2. `yarn dev` for starting in dev mode
3. `yarn build` for building production
4. `yarn start` for starting form production build

* base url: `https://localhost:3000`

## TODO

### Create
* add all the fields to create a blog
* add validation to the creation form of blog
* take user to the update blog page

### Update
* add delete functionality
* on successful deletion send user to myb-logs
* properly update deeply nested elements of blogs

### New Feature
* add like, and comment counter
* add shareable link and counter
* add comment's

## Comments
* coming soon

## using the app
1. `/` - home
2. `/blog` - list of published blogs
3. `/blog/my-blog` - user blogs
4. `/blog/edit` - edit from my-blog list
5. `/blog/create` - create new blog (must be logged in)
6. `/api/auth/signin` - authentication flow (only github works)
7. `/api/auth/signout` - logout
