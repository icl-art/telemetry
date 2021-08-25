# telemetry

Page is visible at https://shreybohra.com/apex-dashboard/

To update the page:
1. SSH into the server from Google Cloud Console
2. cd into `/var/www/html/wp-content/uploads/ICLR/telemetry`
3. Run `sudo git pull`.
4. Start the forwarding script - 'python3 forwarder.py'

If the embedded page is broken, try the direct link.

forwarder.py is set up to be executable on the remote server. 
To run the script in the background, run `nohup python3 forwarder.py &` in the correct directory.
To end the script, run `ps ax | grep forwarder.py` and make a note of the PID. Then, run `kill PID`.
