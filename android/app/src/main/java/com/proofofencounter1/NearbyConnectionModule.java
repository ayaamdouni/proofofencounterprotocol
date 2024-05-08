package com.proofofencounter1;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import android.util.Log;

import android.Manifest;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import android.widget.Toast;
import android.content.Context;
import java.nio.charset.StandardCharsets;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class NearbyConnectionModule extends ReactContextBaseJavaModule {
    private boolean mIsConnecting = false;

	/** True if we are discovering. */
	private boolean mIsDiscovering = false;

	/** True if we are advertising. */
	private boolean mIsAdvertising = false;
	private final ReactApplicationContext reactContext;
    private final String SERVICE_ID = "com.nearbymod.SERVICE_ID";
    private final Strategy STRATEGY = Strategy.P2P_STAR;
    private final List<String> messagesSent = new ArrayList<>();
	private String endpointConnected = "";
	private String receivedMessages = "";
    private int eventNumber = 0;

    NearbyConnectionModule(ReactApplicationContext context) {

        super(context);
        this.reactContext = context;
    }

	@Override
    public String getName() {
        return "NearbyConnectionModule";
    }
	public void setEndpointConnected (String endpointConnected) {
		this.endpointConnected = endpointConnected;
	}

	@ReactMethod
    public void getConnectedEndpoint(Callback callback) {
        callback.invoke(endpointConnected);
    }
	public void setReceivedMessage (String receivedMessages) {
		this.receivedMessages = receivedMessages;
	}

	@ReactMethod
    public void getReceivedMessage(Callback callback) {
        callback.invoke(receivedMessages);
    }
    public void setEventNumber(int number) {
        this.eventNumber = number;
    }
    @ReactMethod
    public void getEventNumber(Callback callback) {
        callback.invoke(eventNumber);
    }
    @ReactMethod
	public void startDiscovering(final String adresse, final String timestampA) {
		DiscoveryOptions discoveryOptions = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
		ConnectionsClient connectionsClient = Nearby.getConnectionsClient(reactContext);
		connectionsClient.startDiscovery(SERVICE_ID, getEndpointDiscoveryCallback(adresse, timestampA), discoveryOptions)
				.addOnSuccessListener(unused -> {
                    WritableMap params= Arguments.createMap();
                    params.putString("property", "anydata");
                    sendEvent(reactContext, "Started Discovering", params);
					Toast.makeText(reactContext, "Started discovering!", Toast.LENGTH_SHORT).show();
					// Log.d("NearbyModule", "Discovery started successfully!");
				})
				.addOnFailureListener(e -> {
					Toast.makeText(reactContext, "Failed!"+e.getMessage(), Toast.LENGTH_SHORT).show();
					// Log.e("NearbyModule", "Failed to start discovery: " + e.getMessage());
				});
	}
	private EndpointDiscoveryCallback getEndpointDiscoveryCallback(final String adresse, final String timestampA){
    	final EndpointDiscoveryCallback endpointDiscoveryCallback =
            new EndpointDiscoveryCallback() {
                @Override
                public void onEndpointFound(String endpointId, DiscoveredEndpointInfo info) {
                    // A new endpoint was found.
                    // Declaring the currentTimeFound variable.
 
                    String toastMessage = "Endpoint found: " + endpointId + info;
                    Toast.makeText(reactContext, toastMessage, Toast.LENGTH_SHORT).show();
                    Log.d("NearbyModule", "Endpoint found: " + endpointId);
                    
                    Nearby.getConnectionsClient(reactContext)
                            .requestConnection(getLocalUserName(), endpointId, getconnectionLifecycleCallback(adresse, timestampA))
                            .addOnSuccessListener(
                                    (Void unused) -> {
                                        // We successfully requested a connection. Now both sides
                                        // must accept before the connection is established.
                                        Toast.makeText(reactContext, "Connection request !", Toast.LENGTH_SHORT).show();
                                        // callback.invoke("result connection");
                                        // tesst();
                                    })
                            .addOnFailureListener(
                                    (Exception e) -> {
                                        Toast.makeText(reactContext, "Connection request failed !"+e.getMessage(), Toast.LENGTH_SHORT).show();
                                        // Nearby Connections failed to request the connection.
                                    });
                }

                @Override
                public void onEndpointLost(String endpointId) {
                    // A previously discovered endpoint has gone away.
                    Toast.makeText(reactContext, "Endpoint lost !", Toast.LENGTH_SHORT).show();
                    Log.d("NearbyModule", "Endpoint lost: " + endpointId);
                    Nearby.getConnectionsClient(reactContext).disconnectFromEndpoint(endpointId);
                } 
            };
			return endpointDiscoveryCallback;
		}
			private ConnectionLifecycleCallback getconnectionLifecycleCallback(final String adresse, final String timestampA) {
            	final ConnectionLifecycleCallback DconnectionLifecycleCallback =
                    new ConnectionLifecycleCallback() {
                        @Override
                        public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
                            // Automatically accept the connection on both sides.
                            Nearby.getConnectionsClient(reactContext).acceptConnection(endpointId, payloadCallback);
                        }
        
                        @Override
                        public void onConnectionResult(String endpointId, ConnectionResolution result) {
                            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                            switch (result.getStatus().getStatusCode()) {
                                case ConnectionsStatusCodes.STATUS_OK:
                                    // We're connected! Can now start sending and receiving data.                                
                                     Toast.makeText(reactContext, "Request Accepted !" , Toast.LENGTH_SHORT).show();
									 setEndpointConnected(endpointId);
                                     Log.d("NearbyModule", "Connected to endpoint: " + endpointId );
									 sendData(1, endpointId, adresse + ' '+ timestampA);
                                    //SENDING DATA BETWEEN DEVICES
									// Convert the strings to bytes
									// byte[] bytesString1 = adresse.getBytes(StandardCharsets.UTF_8);
									// byte[] bytesString2 = timestampA.getBytes(StandardCharsets.UTF_8);

									// Concatenate the byte arrays
									// byte[] combinedBytes = new byte[bytesString1.length + bytesString2.length];
									// System.arraycopy(bytesString1, 0, combinedBytes, 0, bytesString1.length);
									// System.arraycopy(bytesString2, 0, combinedBytes, bytesString1.length, bytesString2.length);

									// Create a payload from the combined bytes
									// Payload bytesPayload = Payload.fromBytes(combinedBytes);

									// Send the payload to the endpoint
									// Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
                                    // Payload bytesPayload = Payload.fromBytes(new byte[] {0xa, 0xb, 0xc, 0xd});
                                    // Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
                                    break;
                                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                                    // The connection was rejected by one or both sides.
                                    Toast.makeText(reactContext, "Request rejected !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection rejected by endpoint: " + endpointId);
                                    break;
                                case ConnectionsStatusCodes.STATUS_ERROR:
                                    // The connection broke before it was able to be accepted.
                                    Toast.makeText(reactContext, "Connection failed for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection failed for endpoint: " + endpointId);
                                    break;
                                default:
                                    // Unknown status code
                                    Toast.makeText(reactContext, "Unknown connection status for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Unknown connection status for endpoint: " + endpointId);
                                    break;
                            }
                        }
        
                        @Override
                        public void onDisconnected(String endpointId) {
                            // We've been disconnected from this endpoint. No more data can be sent or received.
                            Toast.makeText(reactContext, "Disconnected from endpoint !", Toast.LENGTH_SHORT).show();
                            Log.d("NearbyModule", "Disconnected from endpoint: " + endpointId);
                        }
                    };
					return DconnectionLifecycleCallback;
				}

          	@ReactMethod
            public void startAdvertising() {
                AdvertisingOptions advertisingOptions = new AdvertisingOptions.Builder().setStrategy(STRATEGY).build();
                Nearby.getConnectionsClient(reactContext)
                        .startAdvertising(getLocalUserName(), SERVICE_ID, AconnectionLifecycleCallback, advertisingOptions)
                        .addOnSuccessListener(
                                (Void unused) -> {
                                    // We're advertising!
                                    Toast.makeText(reactContext, "Started advertising!", Toast.LENGTH_SHORT).show();
                                    // callback.invoke("qsdfghjk");
                                    Log.d("NearbyModule", "Advertising started successfully!");
                                })
                        .addOnFailureListener(
                                (Exception e) -> {
                                    // We were unable to start advertising.
                                    Toast.makeText(reactContext, e.getMessage(), Toast.LENGTH_LONG).show();
                                    Log.e("NearbyModule", "Failed to start advertising: " + e.getMessage());
                                });
            }
    // advertising callback
            private final ConnectionLifecycleCallback AconnectionLifecycleCallback =
                    new ConnectionLifecycleCallback() {
                        @Override
                        public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
                            // Automatically accept the connection on both sides.
                            Nearby.getConnectionsClient(reactContext).acceptConnection(endpointId, payloadCallback);
                        }
        
                        @Override
                        public void onConnectionResult(String endpointId, ConnectionResolution result) {
                            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                            switch (result.getStatus().getStatusCode()) {
                                case ConnectionsStatusCodes.STATUS_OK:
                                    // We're connected! Can now start sending and receiving data.

                                    Toast.makeText(reactContext, "Request Accepted !" , Toast.LENGTH_SHORT).show();
                                    Log.d("NearbyModule", "Connected to endpoint: " + endpointId );
									// sendData(endpointId, "hello from advertiser");
									setEndpointConnected(endpointId);
                                    // tesst();
                                    //SENDING DATA BETWEEN DEVICES
                                    //Payload bytesPayload = Payload.fromBytes(new byte[] {0xa, 0xb, 0xc, 0xd});
                                    // Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
                                    break;
                                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                                    // The connection was rejected by one or both sides.
                                    Toast.makeText(reactContext, "Request rejected !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection rejected by endpoint: " + endpointId);
                                    break;
                                case ConnectionsStatusCodes.STATUS_ERROR:
                                    // The connection broke before it was able to be accepted.
                                    Toast.makeText(reactContext, "Connection failed for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection failed for endpoint: " + endpointId);
                                    break;
                                default:
                                    // Unknown status code
                                    Toast.makeText(reactContext, "Unknown connection status for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Unknown connection status for endpoint: " + endpointId);
                                    break;
                            }
                        }
        
                        @Override
                        public void onDisconnected(String endpointId) {
                            // We've been disconnected from this endpoint. No more data can be sent or received.
                            Toast.makeText(reactContext, "Disconnected from endpoint !", Toast.LENGTH_SHORT).show();
                            Log.d("NearbyModule", "Disconnected from endpoint: " + endpointId);
                        }
                    };
            @ReactMethod
            public void stopDiscovering() {
                Nearby.getConnectionsClient(reactContext).stopDiscovery();
                Toast.makeText(reactContext, "Stoped Discovering !", Toast.LENGTH_SHORT).show();
            }
            @ReactMethod
            public void stopAdvertising() {
                Nearby.getConnectionsClient(reactContext).stopAdvertising();
                Toast.makeText(reactContext, "Stoped Advertising !", Toast.LENGTH_SHORT).show();
            }
			@ReactMethod
			public void sendData(int number, String endpointId, String message) {
                setEventNumber(number);
				byte[] bytesMessage = message.getBytes(StandardCharsets.UTF_8);

				// Concatenate the byte arrays
				byte[] combinedBytes = new byte[bytesMessage.length];
				System.arraycopy(bytesMessage, 0, combinedBytes, 0, bytesMessage.length);

				// Create a payload from the combined bytes
				Payload bytesPayload = Payload.fromBytes(combinedBytes);

				// Send the payload to the endpoint
				Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
			}
            private final PayloadCallback payloadCallback = new PayloadCallback() {
                @Override
                public void onPayloadReceived(String endpointId, Payload payload) {
                    if (payload.getType() == Payload.Type.BYTES) {
                        byte[] receivedBytes = payload.asBytes();
                        // Decode the received bytes into a string using UTF-8 encoding
                        String receivedMessage = new String(receivedBytes, StandardCharsets.UTF_8);
                        String toastMessage = "New message received: " + receivedMessage;
                        setReceivedMessage(receivedMessage);
                        Toast.makeText(reactContext, toastMessage, Toast.LENGTH_SHORT).show();
                        // Emitting the event to JS 
                        WritableMap params= Arguments.createMap();
                        params.putString("MessageReceived", receivedMessage);
                        switch(eventNumber) {
                            case 1:
                              sendEvent(reactContext, "initEncounterEvent", params);
                              break;
                            case 2:
                              sendEvent(reactContext, "retrieveTEncounterEvent", params);
                              break;
                            case 3:
                              sendEvent(reactContext, "retrieveFEncounterEvent", params);
                              break;
                            default:
                              Toast.makeText(reactContext, "Unknown Event", Toast.LENGTH_SHORT).show();
                          }                        
                    }
                    // A new payload has been received.
                    Log.d("NearbyModule", "Payload received from endpoint: " + endpointId);
                }
        
                @Override
                public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {
                    // The status of the payload transfer has been updated.
                    Log.d("NearbyModule", "Payload transfer update for endpoint: " + endpointId);
                }
            };
        
            private String getLocalUserName() {
                // You can implement your logic to get the local user's name here.
                return "LocalUser";
            }
            private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
            }
}