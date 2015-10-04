package tccii.fernando.tccii_agentsmonitoring;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;

import com.squareup.okhttp.Request;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class RulesCreation extends AppCompatActivity implements MultiSpinner.MultiSpinnerListener {

    private ArrayList<String> names = new ArrayList<String>();
    private ArrayList<Integer> selected_sensors = new ArrayList<Integer>();
    private JSONArray sensors_array;
    private ArrayAdapter<String> adapter;
    private boolean free=false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rules_creation);


        Button createRules = (Button) findViewById(R.id.monitorBtn);
        createRules.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {

                    Thread thread = new Thread(new Runnable() {
                        @Override
                        public void run() {
                            JSONInterface jsonInterface = new JSONInterface();
                            jsonInterface.createRule(sensors_array, selected_sensors,getApplicationContext());

                        }
                    });
                    thread.start();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        LinearLayout sensorListLayour = (LinearLayout) findViewById(R.id.sensorsListLayour);
        setContentView(sensorListLayour);
        final MultiSpinner listView = (MultiSpinner) findViewById(R.id.listSensors);
        //listView.setSelector(R.drawable.rules_selector);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                listView.requestFocus();
                listView.setSelection(0);
            }
        });

        JSONCall jsonCall = new JSONCall();
        jsonCall.execute(adapter);
        while(!free){}
        populateListView();


    }



    private void populateListView()
    {
        final MultiSpinner listView = (MultiSpinner)findViewById(R.id.listSensors);
        //adapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1, names);
        listView.setItems(names, "Test", this);
        //listView.setAdapter(adapter);


       // adapter.notifyDataSetChanged();

    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_rules_creation, menu);
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

    private class JSONCall extends AsyncTask<ArrayAdapter<String>,Void,ArrayList<String>> {


        @Override
        protected ArrayList<String> doInBackground(ArrayAdapter<String>... adapters)
        {

            ArrayAdapter<String> adapter = adapters[0];
            return postJson(adapter);
        }

        private JSONObject getJson()
        {
            return null;
        }

        private ArrayList<String> postJson(ArrayAdapter<String> adapter){
            String ret = "";
            ArrayList<String> sensors_name = new ArrayList<String>();

            try {

                    OkHttpClient client = new OkHttpClient();
                    String url = "http://192.168.0.13:3001/sensors/listSensors";
                    Request request = new Request.Builder().url(url).build();
                    Response response = client.newCall(request).execute();
                    ret = response.body().string();

                    JSONArray json = new JSONArray(ret);
                    for(int i=0;i<json.length();i++)
                    {
                        JSONObject element = (JSONObject)json.get(i);
                        String name = element.getString("sensor_name");
                        sensors_name.add(name);
                    }
                setSensorsNames(sensors_name);
                setListOfSensors(json);

            } catch (Exception e) {
                e.printStackTrace();
                //httpPost.abort();

            }
            finally{
                free = true;
                return sensors_name;
            }

        }



        @Override
        protected void onPreExecute() {
        }

        @Override
        protected void onProgressUpdate(Void... values) {
        }
    }
    @Override
    public void onItemsSelected(boolean[] selected) {

        for(int i=0;i<selected.length;i++)
        {
            if(!this.selected_sensors.contains(selected[i]))
            {
                this.selected_sensors.add(i);
            }
        }
    }
    private void setSensorsNames(ArrayList<String> names)
    {
        this.names.addAll(names);
    }

    private void setListOfSensors(JSONArray array)
    {
        this.sensors_array = array;
    }

}
