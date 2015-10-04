package tccii.fernando.tccii_agentsmonitoring;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.estimote.sdk.Beacon;
import com.estimote.sdk.BeaconManager;
import com.estimote.sdk.Region;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import org.json.JSONObject;


import java.io.IOException;
import java.util.List;


public class MainActivity extends AppCompatActivity {
    String SENDER_ID = "AIzaSyDtaYNpPsYahCeGxxzjFTyQka3SdojHlZM";
    private static final String ESTIMOTE_PROXIMITY_UUID = "B9407F30-F5F8-466E-AFF9-25556B57FE6D";
    private static final Region ALL_ESTIMOTE_BEACONS = new Region("regionId", ESTIMOTE_PROXIMITY_UUID, null, null);
    private static final String TAG = "MainActivity";
    private BeaconManager beaconManager;
    private String host;
    private JSONInterface jsonInterface;
    private String registerID;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

       // getRegId();

        jsonInterface = new JSONInterface();
        setContentView(R.layout.activity_main);
        beaconManager = new BeaconManager(this);
        final TextView view = (TextView) findViewById(R.id.text);

        Button button = (Button) findViewById(R.id.sendRequest);
        button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                EditText ip = (EditText) findViewById(R.id.ip);
                host = ip.getText().toString();
                EditText id = (EditText) findViewById(R.id.id);
                try{
                    beaconManager.stopRanging(ALL_ESTIMOTE_BEACONS);
                }catch(Exception e)
                {
                    e.printStackTrace();
                }
                jsonInterface.sendJson(null);
            }
        });


        Button rulesBtn = (Button) findViewById(R.id.rulesButton);
        rulesBtn.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                Intent rulesIntent = new Intent(v.getContext(),RulesCreation.class);
                startActivity(rulesIntent);
            }
        });


        /*beaconManager.setRangingListener(new BeaconManager.RangingListener() {
            @Override
            public void onBeaconsDiscovered(Region region, final List<Beacon> beacons) {

                Log.d("Estimote", "Ranged beacons: " + beacons);
                JSONObject root = null;
                try {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                          //  jsonInterface.addAgent(beacons);
                        }
                    });

                }
                catch(Exception e )
                {
                    e.printStackTrace();
                }

            }
        });*/


    }
    private void setHost(String host)
    {
        this.host = host;
    }


    @Override
    protected void onStart() {
        super.onStart();
        beaconManager.connect(new BeaconManager.ServiceReadyCallback() {
            @Override
            public void onServiceReady() {
                try {
                   // beaconManager.startRanging(ALL_ESTIMOTE_BEACONS);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    protected void onStop()
    {
        super.onStop();
        try{
           // beaconManager.stopRanging(ALL_ESTIMOTE_BEACONS);
        }catch(Exception e)
        {
            e.printStackTrace();
        }
        finally{
            super.onStop();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void getRegId(){
        new AsyncTask<Void, Void, String>() {
            @Override
            protected String doInBackground(Void... params) {
                String msg = "";
                GoogleCloudMessaging gcm=null;
                String regid;
                try {

                    if (gcm == null) {
                        gcm = GoogleCloudMessaging.getInstance(getApplicationContext());
                    }
                    regid = gcm.register("900440641312");
                    msg = "Device registered, registration ID=" + regid;
                    setRegID(regid);
                    Log.i("GCM",  msg);

                } catch (IOException ex) {
                    msg = "Error :" + ex.getMessage();

                }
                return msg;
            }

            @Override
            protected void onPostExecute(String msg) {

            }
        }.execute(null, null, null);
    }

    private void setRegID(String rid)
    {

        registerID = rid;
        Log.d("VAL_REGID ",registerID);
        Storage.saveData(registerID,getApplicationContext());
    }

}


