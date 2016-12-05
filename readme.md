## Welcome to Codename Vigilant Dollop

This is a scratchpad to work out the core mechanics and API of reservat.
Feel free to change/PR as appropriate, we need to work fast and break things as we go, mappings etc are subject to change, as will be queries
until we find the fastest method by which to serve the appropriate user data through the API.

Request config settings from me :D


## Restaurant Endpoints

### {id}/availability

#### params

`guests` - Number of seats required

`day` - Unix Timestamp
-- or --
Range:
`rangeStart` - Unix Timestamp
`rangeEnd` - Unix Timestamp
-- or --
Slot:
`slot` - Unix Timestamp

Returns an array of bookable slots.

#### Nice to have:
If the user requests a specific slot but it is not available return nearby time slots by a variable amount (1/2 hours?)

