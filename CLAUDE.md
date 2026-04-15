# Frontend for KRP-YAML Web application

The frontend will replace the current HXWD and Kanripo web sites. 

## Ideas

Texts are in a YAML format that is still under development.  Some samples are in ../data/texts/

We want a one page web application that after loading interacts with a backend via API calls. A start for this has been made here: 
'/home/chris/Dropbox/projects/krp-tools/api/openapi.yaml'

Users will login with a GitHub ID.  In prod texts will also be loaded from GH account krp-yaml.  Users can clone them and edit -> PR. 

Interactive text editing of the YAML texts will happen in the browser and saved back to the user GH account. 

There are other parts of the app in Markdown format, we will also need a markdown editor. 
