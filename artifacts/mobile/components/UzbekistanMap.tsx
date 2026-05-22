import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { CITIES } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

const CITY_COORDS: Record<string, [number, number]> = {
  toshkent:  [41.2995, 69.2401],
  samarqand: [39.6542, 66.9597],
  buxoro:    [39.7747, 64.4286],
  nukus:     [42.4619, 59.6076],
  fargona:   [40.3742, 71.7878],
  namangan:  [41.0022, 71.6726],
  andijon:   [40.7821, 72.3443],
  qarshi:    [38.8604, 65.7902],
};

function getAQIColor(aqi: number): string {
  if (aqi <= 50)  return '#22D3A5';
  if (aqi <= 100) return '#F59E0B';
  if (aqi <= 150) return '#F97316';
  if (aqi <= 200) return '#EF4444';
  return '#A855F7';
}

function getAQILabel(aqi: number): string {
  if (aqi <= 50)  return "Yaxshi";
  if (aqi <= 100) return "O'rtacha";
  if (aqi <= 150) return "Zararli";
  if (aqi <= 200) return "J.Zararli";
  return "Xavfli";
}

interface UzbekistanMapProps {
  onCityPress?: (cityId: string) => void;
  height?: number;
}

export function UzbekistanMap({ onCityPress, height = 320 }: UzbekistanMapProps) {
  const colors = useColors();

  const citiesData = CITIES.map((city) => ({
    id: city.id,
    name: city.nameUz,
    aqi: city.aqi,
    temp: city.temperature,
    conditions: city.conditions,
    lat: CITY_COORDS[city.id]?.[0] ?? 41,
    lng: CITY_COORDS[city.id]?.[1] ?? 64,
    color: getAQIColor(city.aqi),
    label: getAQILabel(city.aqi),
  }));

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body, html { background:#070D1B; width:100%; height:100%; overflow:hidden; }
  #map { width:100%; height:100vh; }
  .leaflet-popup-content-wrapper {
    background:#0D1B2E;
    border:1px solid rgba(0,229,195,0.3);
    border-radius:12px;
    box-shadow:0 4px 20px rgba(0,0,0,0.5);
    color:#E2E8F0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .leaflet-popup-tip { background:#0D1B2E; }
  .leaflet-popup-close-button { color:#94A3B8 !important; font-size:18px !important; }
  .city-popup-title { font-size:15px; font-weight:700; color:#E2E8F0; margin-bottom:6px; }
  .city-popup-aqi { font-size:28px; font-weight:800; margin:4px 0; }
  .city-popup-label { font-size:11px; font-weight:600; letter-spacing:1px; margin-bottom:6px; }
  .city-popup-meta { font-size:12px; color:#94A3B8; margin:2px 0; }
  .city-popup-btn {
    margin-top:10px; background:rgba(0,229,195,0.15); border:1px solid rgba(0,229,195,0.4);
    color:#00E5C3; border-radius:8px; padding:7px 14px; cursor:pointer; width:100%;
    font-size:12px; font-weight:600; letter-spacing:0.5px;
  }
  .city-popup-btn:hover { background:rgba(0,229,195,0.25); }
  .leaflet-container { background:#070D1B; }
  .leaflet-control-zoom { display:none; }
  .leaflet-control-attribution { display:none; }
</style>
</head>
<body>
<div id="map"></div>
<script>
var rn = window.ReactNativeWebView || { postMessage: function(m){ console.log(m); } };

var map = L.map('map', {
  center: [41.0, 63.5],
  zoom: 5,
  zoomControl: false,
  attributionControl: false,
  dragging: true,
  touchZoom: true,
  scrollWheelZoom: false,
  doubleClickZoom: true
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 10,
  minZoom: 4,
  subdomains: 'abcd'
}).addTo(map);

var cities = ${JSON.stringify(citiesData)};

cities.forEach(function(city) {
  if (!city.lat || !city.lng) return;

  var icon = L.divIcon({
    className: '',
    html: '<div onclick="cityClicked(\\''+city.id+'\\')" style="'+
      'width:64px; height:64px; display:flex; align-items:center; justify-content:center; '+
      'flex-direction:column; cursor:pointer; position:relative;">'+
      '<div style="'+
        'width:54px; height:54px; border-radius:50%; background:'+city.color+'; '+
        'opacity:0.15; position:absolute; top:5px; left:5px; animation:pulse 2s infinite;">'+
      '</div>'+
      '<div style="'+
        'width:44px; height:44px; border-radius:50%; background:'+city.color+'; '+
        'border:2px solid rgba(255,255,255,0.4); display:flex; align-items:center; '+
        'justify-content:center; flex-direction:column; position:relative; z-index:1; '+
        'box-shadow:0 2px 12px '+city.color+'66;">'+
        '<span style="color:#fff; font-size:13px; font-weight:800; line-height:1;">'+city.aqi+'</span>'+
        '<span style="color:rgba(255,255,255,0.8); font-size:7px; font-weight:600; letter-spacing:0.5px;">AQI</span>'+
      '</div>'+
    '</div>',
    iconSize: [64, 64],
    iconAnchor: [32, 32]
  });

  var nameIcon = L.divIcon({
    className: '',
    html: '<div style="'+
      'background:rgba(7,13,27,0.85); border:1px solid rgba(255,255,255,0.15); '+
      'border-radius:4px; padding:2px 6px; white-space:nowrap; margin-top:46px; margin-left:-20px;">'+
      '<span style="color:#E2E8F0; font-size:10px; font-weight:600;">'+city.name+'</span>'+
    '</div>',
    iconSize: [80, 20],
    iconAnchor: [40, 0]
  });

  L.marker([city.lat, city.lng], {icon: icon, zIndexOffset: 100}).addTo(map);
  L.marker([city.lat, city.lng], {icon: nameIcon, interactive: false}).addTo(map);
});

function cityClicked(cityId) {
  rn.postMessage(JSON.stringify({type:'cityPress', id:cityId}));
}

window.cityClicked = cityClicked;
</script>
</body>
</html>`;

  function handleMessage(event: { nativeEvent: { data: string } }) {
    try {
      const data = JSON.parse(event.nativeEvent.data) as { type: string; id?: string };
      if (data.type === 'cityPress' && data.id) {
        onCityPress?.(data.id);
      }
    } catch {}
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height, borderRadius: 16, overflow: 'hidden' }]}>
        <iframe
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none' } as any}
          sandbox="allow-scripts allow-same-origin"
          title="Iqlimoy Xarita"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, borderRadius: 16, overflow: 'hidden' }]}>
      <WebView
        source={{ html }}
        onMessage={handleMessage}
        style={styles.webview}
        scrollEnabled={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
        androidLayerType="hardware"
        overScrollMode="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#070D1B',
  },
  webview: {
    flex: 1,
    backgroundColor: '#070D1B',
  },
});
