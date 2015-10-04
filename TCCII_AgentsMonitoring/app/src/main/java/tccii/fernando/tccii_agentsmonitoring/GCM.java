package tccii.fernando.tccii_agentsmonitoring;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;

/**
 * Created by Fernando on 27/09/2015.
 */
public class GCM{
    private GoogleCloudMessaging gcm;
    private String PROJECT_NUMBER = "900440641312";

    public String getRegId(Context context) {
        String ret = "ERROR";
        Log.d("Entrei ","1");
        try {
             ret = new AsyncTask<Context, Void, String>() {

                 @Override
                protected String doInBackground(Context... params) {
                     Log.d("Entrei ","2");

                     Context context = params[0];
                    String regid = "";
                    String msg = "";
                    try {
                        Log.d("Entrei ","3");

                        if (gcm == null) {
                            gcm = GoogleCloudMessaging.getInstance(context);
                        }
                        Log.d("Entrei ","4");

                        regid = gcm.register(PROJECT_NUMBER);
                        Log.d("RESPONSE",regid);
                        msg = "Device registered, registration ID=" + regid;
                        Log.i("GCM", msg);

                    } catch (IOException ex) {
                        msg = "Error :" + ex.getMessage();
                        ex.printStackTrace();
                        Log.d("ERROR: ",ex.getMessage());

                    }
                    Log.d("RegID",regid);
                    return regid;
                }

                @Override
                protected void onPostExecute(String msg) {
                }
            }.execute(context, null, null).get();

        }catch(Exception e)
        {
            e.printStackTrace();
            Log.d("ERROR ",e.getMessage());
        }
        finally{
            Log.d("GCM:", "AQUI");
            Storage.saveData("LALALAL",context);
            Log.d("STORAGE: ",ret);
            return ret;
        }
    }
}
