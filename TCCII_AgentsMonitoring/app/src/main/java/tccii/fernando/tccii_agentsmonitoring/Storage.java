package tccii.fernando.tccii_agentsmonitoring;

import android.content.Context;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

/**
 * Created by Fernando on 27/09/2015.
 */
public class Storage {
    private static String FILENAME = "TCC_Data";
    public static void saveData(String data, Context context)
    {
        try {

            if(!fileExists(context)) {
                FileOutputStream fOut = context.openFileOutput(FILENAME, Context.MODE_PRIVATE);
                fOut.write(data.getBytes());
                fOut.close();
                Log.d("Storage: ", "SUCCESS");
            }

        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
    }

    public static boolean fileExists(Context context)
    {
        File file = context.getFileStreamPath(FILENAME);
        return file.exists();
    }

    public static String getData(Context context)
    {
        String ret="";
        try {
            FileInputStream fin = context.openFileInput(FILENAME);
            int c;
            while ((c = fin.read()) != -1) {
                ret += Character.toString((char) c);
            }
            Log.d("READ ", ret);
            fin.close();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        finally{
            return ret;
        }

    }
}
