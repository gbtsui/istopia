# Istopia
Istopia is an interactive literature engine for turning your writing into cooler writing by converting it from text to slightly cooler text with styling and some animations. Text and objects can react to events and (eventually) inputs. Kind of like Twine (not actually a tool I've actually tried before...) but with a custom block system, drag and drop editing and event-driven storytelling. Built for Hack Club Neighborhood '25!

## Technologies used
Next.js, TypeScript, Prisma, Supabase PostgreSQL, Vercel, Tailwind, dnd-kit, Zustand, Zod, React Flow, Next-Auth

## How to use

So, this is kind of the hard part. I'm going to replace this with actual docs eventually, but I'll give a brief high-level overview here.
### The Platform
Make an account, play with your profile a bit, view and publish pieces. There's not too much too it at the moment as the majority of my time spent on this has been on the other 2 components.
### The Editor
This is where the fun bits start. Pieces are made up of pages which can link together, starting at the first page. You can edit pages to edit their contents.

Pages contain blocks, which displays objects like other blocks or stylized text (at the moment, only text is supported, really). You can reorder then on the left to change the order of how they're displayed on the piece or drag blocks into containers (the mechanism is really weird which is an unfortunate byproduct of dnd-kit being really weird with nesting, so just drag a block above a container to put it inside.)
On the right side, you can insert blocks into the triggers graph. The graph displays how the blocks react to each others' events and how they trigger new events. At the top, you can insert a block you have in the page into the triggers graph and connect the events (right side) to other actions (left side). When the event is emitted (ex. a typewriter finishes typing), any actions that it's connected to (ex. trigger the next line) will be fired. 
### The Engine
There's not much to say here from a user perspective, but it just displays and renders the pieces that you've created.

## Known Issues
- Dragging in and out of containers is really weird. I haven't really figured out what the best way of fixing it is, to be honest. I'm not even sure if it's fixable with dnd-kit.
- Documentation is almost nonexistent. I want to implement everything that I want to implement before I start on docs, though.


Anyways, yeah, that's about it. I'm really bad at writing READMEs.
