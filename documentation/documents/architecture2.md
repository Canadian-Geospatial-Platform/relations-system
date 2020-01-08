# Design choices

## Unique Id for relations

Having a unique Id identifying relations between items allows for straightforward and safe RESTfull api calls for two way relationships and to add informations such as relationship begin and end date if we wish to preserve such information later down the road.

### example

ex: /team/2/player/10

player 10 could have been in team 2 from 1995 to 2001 and from 2003 to 2005.
