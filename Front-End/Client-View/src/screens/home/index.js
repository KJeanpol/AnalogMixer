import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors, commonStyles } from "../../config/styles";
import { createStackNavigator } from "react-navigation";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground
} from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Title,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  StyleProvider,
  Footer,
  FooterTab
} from "native-base";
import platform from "../../../node_modules/native-base/src/theme/variables/platform";
import getTheme from "../../../node_modules/native-base/src/theme/components";

import Dashboard from "../dashboard/index";
import MQTTClient from "../../services/mqtt";
import wallpaper from "../../assets/wallpaper.jpg";
import IconDrinkRed from "../../assets/drinkred.png";
import IconDrinkBlue from "../../assets/drinkblue.png";
import IconDrinkGreen from "../../assets/drinkgreen.png";
import {
  OPTIONS,
  SCREENS,
  NUMBER_OF_COLUMNS,
  TOPICS,
  IMAGES
} from "../../config/constants";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;
const num = 3;

const options = [OPTIONS.DRINKRED, OPTIONS.DRINBLUE, OPTIONS.DRINKGREEN];
const images = [IconDrinkRed,IconDrinkBlue,IconDrinkGreen];

const optionsValues = [1, 2, 3];
export default class Home extends Component {
  numItems = num;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  _onOptionPressed = async value => {
    MQTTClient([value[0]], TOPICS.TOPIC_1);
    ToastAndroid.show(value[1], ToastAndroid.SHORT);
  };
  
  render() {
    let imageArray = [];
    let barArray = [];
    images.forEach((image, i) => {
      const scrollBarVal = this.animVal.interpolate({
        inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: "clamp"
      });

      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: this.itemWidth,
              marginLeft: i === 0 ? 0 : BAR_SPACE
            }
          ]}
        >
          <Animated.View
            style={[
              styles.bar,
              {
                width: this.itemWidth,
                transform: [{ translateX: scrollBarVal }]
              }
            ]}
          />
        </View>
      );
      barArray.push(thisBar);
    });
    return (
      <ImageBackground
        source={{ uri: 'https://payload.cargocollective.com/1/3/104579/13562334/UES-Images-1_1920.jpg' }}
        imageStyle={{ resizeMode: "cover" }}
        style={styles.backgroundImage}
      >
        <StyleProvider style={getTheme(platform)}>
          <Container transparent>
            <Header transparent />
            <Content>
              <Card transparent>
                <CardItem header>
                  <Text style={commonStyles.textTitle}>SMART~COCTAILS</Text>
                </CardItem>
              </Card>
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Card>
                  <Header
                    style={{
                      borderWidth: 0,
                      elevation: 0,
                      alignSelf: "center"
                    }}
                  >
                    <Left />
                    <Body>
                      <View style={styles.barContainer}>{barArray}</View>
                    </Body>
                    <Right />
                  </Header>
                  <CardItem cardBody>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      scrollEventThrottle={10}
                      pagingEnabled
                      onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { x: this.animVal } } }
                      ])}
                    >
                      <TouchableOpacity
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this._onOptionPressed([1, "Ron"])
                        }
                      >
                        <Image
                          style={{ height: 200, width: 200, flex: 1 }}
                          source={require("../../assets/drinkred.png")}
                        />
                        <Text style={commonStyles.textSpace}>Ron </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this._onOptionPressed([2, "Coca Cola"])
                        }
                      >
                        <Image
                          style={{ height: 200, width: 200, flex: 1 }}
                          source={require("../../assets/drinkblue.png")}
                        />
                        <Text style={commonStyles.textSpace}>Coca Cola </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this._onOptionPressed([3, "Whiskey"])
                        }
                      >
                        <Image
                          style={{ height: 200, width: 200, flex: 1 }}
                          source={require("../../assets/drinkgreen.png")}
                        />
                        <Text style={commonStyles.textSpace}>Wiskey </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </CardItem>
                </Card>
              </View>
            </Content>
            <Footer>
              <FooterTab>
                <Button
                  style={{ backgroundColor: "#B27C15" }}
                  vertical
                  onPress={() => this.props.navigation.navigate("Dashboard")}
                >
                  <Icon name="pulse" />
                  <Text>Dashboard</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        </StyleProvider>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  barContainer: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    flexDirection: "row"
  },
  track: {
    backgroundColor: "#ccc",
    overflow: "hidden",
    height: 2
  },
  bar: {
    backgroundColor: "#5294d6",
    height: 2,
    position: "absolute",
    left: 0,
    top: 0
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover" // or 'stretch'
  },
  demoFont: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
    fontStyle: "normal",
    textTransform: "none"
  }
});