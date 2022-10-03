import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Dimensions, Text, View, ActivityIndicator } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { API_KEY } from "@env";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icons = {
  1: "cart",
  2: "bell",
  3: "camera",
  4: "chart",
  5: "check",
  6: "arrow-up",
  7: "credit-card",
};

export default function App() {
  const [city, setCity] = useState("로딩중...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    console.log("1 -> ", granted);
    if (!granted) {
      return setOk(false);
    }
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    console.log("2 -> ", latitude, longitude);
    let place = Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    console.log("3 -> ", place);
    if ((await place).length > 0) {
      setCity("성남");
    }
    let data = [1, 2, 3, 4, 5, 6, 7];
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=${7}&appid=${API_KEY}`
      );
      // let json = await res.json();
      console.log("4 -> ", json);
      setDays(json);
    } catch (err) {
      console.log("err ->", err);
      let start = 0;
      let timer = setInterval(() => {
        start += 1;
        console.log(`${start}초 경과`);
        if (start > 3) {
          setDays(data);
          clearInterval(timer);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    getWeather();
    console.log("f -> ", days);
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.exam_container}>
        {/* <Text style={styles.text}>헬로 월드</Text> */}
        {/* <View style={{ flex: 1, backgroundColor: 'tomato' }} />
        <View style={{ flex: 1, backgroundColor: 'orange' }} /> */}
        <View style={styles.city}>
          <Text style={styles.city_name}>{city}</Text>
        </View>
        <View style={styles.data}>
          <ScrollView
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.weather}
          >
            {days.length === 0 ? (
              <View style={styles.day}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
                  <Text style={styles.test}>데이터 없음</Text>
                </View>
              </View>
            ) : (
              days.map((day, idx) => (
                <View key={idx} style={styles.day}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ ...styles.temp, fontSize: 178 }}>{day * day}</Text>
                    <EvilIcons name={icons[day]} size={68} color="black" />
                  </View>
                  <Text style={styles.description}>월요일 {day}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // 기본값
    // flexDirection: 'column',
    flexDirection: "row",
  },
  text: {
    fontSize: 32,
    color: "red",
  },
  exam_container: {
    flex: 1,
    backgroundColor: "teal",
  },
  city: {
    flex: 1.2,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  city_name: {
    color: "white",
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
    backgroundColor: "tomato",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  data: {
    flex: 3,
  },
  test: {
    fontSize: 60,
  },
});
