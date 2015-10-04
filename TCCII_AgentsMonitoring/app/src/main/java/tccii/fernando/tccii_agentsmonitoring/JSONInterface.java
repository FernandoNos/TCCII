package tccii.fernando.tccii_agentsmonitoring;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.estimote.sdk.Beacon;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import com.estimote.sdk.Utils;
import com.squareup.okhttp.HttpUrl;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request.Builder;


import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by Fernando on 26/09/2015.
 */
public class JSONInterface {

    public String createRule(JSONArray sensor_names, ArrayList<Integer> sensors_selected,Context context)
    {
        String ret = "";
        String id = Storage.getData(context);
        JSONObject device_id = new JSONObject();
        try {
            String url = "http://192.168.0.13:3001/rules/createrule";
            for (int i = 0; i < sensor_names.length(); i++) {
                if (!sensors_selected.contains(i)) {
                    sensor_names.remove(i);
                } else {
                    JSONObject element = (JSONObject) sensor_names.get(i);
                    element.put("device_id", id);
                }
            }
            Log.d("SENSORS ", sensor_names.toString());
            JSONCall jsonCall = new JSONCall();
            jsonCall.setURL(url);
            ret =  jsonCall.execute(sensor_names.toString(), "POST").get();
        }catch(Exception e)
        {
            e.printStackTrace();
        }
        finally{
            return ret;
        }


    }
    public  JSONObject sendJson(List<Beacon> beacons)
    {
        //Log.d("BEACONS ",beacons.toString());
        JSONObject root = new JSONObject();
        JSONObject json = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        try {
           // for (Beacon beacon : beacons) {
            for(int i=0;i<1;i++){
                json.put("id", 4);
                json.put("controller_id", i);
                json.put("proximity", "FAR");
                jsonArray.put(json);
                json = new JSONObject();
            }
            root.put("controllers", jsonArray);
            Log.d("JSONInterface ", root.toString());
            JSONCall jsonCall = new JSONCall();
            jsonCall.setURL("http://192.168.0.13:3002/controller/addagent");
            String retorno = jsonCall.execute(root.toString(),"POST").get();

            return root;
        }catch(Exception e)
        {
            e.printStackTrace();
            while(true){}
        }
    }

    private class JSONCall extends AsyncTask<String,Void,String> {

        private String url;

        public void setURL(String url)
        {
            this.url = url;
        }
        public String POST(String jsonObject)
        {
            return doInBackground(jsonObject);
        }
        public String POST(String jsonObject,String url){
           this.url = url;
            return doInBackground(jsonObject);
        }
        @Override
        protected String doInBackground(String... jsons)
        {
            return postJson(jsons);
        }

        private JSONObject getJson()
        {
            return null;
        }

        private String postJson(String... jsons ){
            String ret = "Success!";
            try {

                String json = (String) jsons[0];
                Log.d("JSONInterface ", json);

                OkHttpClient okClient = new OkHttpClient();
                okClient.setReadTimeout(10, TimeUnit.SECONDS);
                final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

                RequestBody body = RequestBody.create(JSON, json);
                Request request = new Request.Builder().url(url).post(body).build();
                Response response = okClient.newCall(request).execute();
                Log.d("RESPONSE ",response.body().string());

            } catch (Exception e) {
                e.printStackTrace();
                ret = e.toString();
            }
            finally{

                return ret;
            }
        }

        @Override
        protected void onPostExecute(String result) {
        }

        @Override
        protected void onPreExecute() {
        }

        @Override
        protected void onProgressUpdate(Void... values) {
        }
    }
}
