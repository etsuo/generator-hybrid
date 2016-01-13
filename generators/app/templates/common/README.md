# Purpose
This is where common custom libraries shared by both the web app and the mobile app should go.

Don't put common managed dependencies here since those will be managed by bower. If you do add a bower
dependency, make sure you update both the web app and mobile app project.

The mobile app and the web app both have a step in their gulp file that includes this project.
