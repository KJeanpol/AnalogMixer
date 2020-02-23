import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors, commonStyles } from "../../config/styles";
import { createStackNavigator } from "react-navigation";
import {
  AnimatedGaugeProgress,
  GaugeProgress
} from "react-native-simple-gauge";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  ToastAndroid
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

import platform from "../../../native-base-theme/variables/platform";
import getTheme from "../../../native-base-theme/components";
import wallpaper from "../../assets/wallpaper.jpg";
import MQTTClient from "../../services/mqtt";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const size = 200;
const width = 15;
const cropDegree = 90;
const textOffset = width;
const textWidth = size - textOffset * 2;
const textHeight = size * (1 - cropDegree / 360) - textOffset * 2;

let graphValue = 20;

const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;
const num = 3;

const images = [
  "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
  "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
  "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg"
];

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      visible: false,
      porcentage: 50
    };
  }

  numItems = num;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  _onOptionPressed = async value => {
    MQTTClient([value[0]]);
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
        source={{
          uri:
            "https://payload.cargocollective.com/1/3/104579/13562334/UES-Images-1_1920.jpg"
        }}
        imageStyle={{ resizeMode: "cover" }}
        style={styles.backgroundImage}
      >
        <StyleProvider style={getTheme(platform)}>
          <Container transparent>
            <Header transparent />
            <Content>
              <Card>
                <CardItem
                  header
                  button
                  onPress={() => this.props.navigation.navigate("Dashboard")}
                >
                  <Text style={commonStyles.textTitle}>Dashboard</Text>
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
                      <View
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                      >
                        <AnimatedGaugeProgress
                          size={200}
                          width={15}
                          fill={graphValue}
                          rotation={90}
                          cropDegree={90}
                          tintColor="#B27C15"
                          delay={0}
                          backgroundColor="#A44105"
                          stroke={[2, 2]} //For a equaly dashed line
                          strokeCap="circle"
                        >
                          <View style={styles.textView}>
                            <Text style={commonStyles.textTitle}>Ron</Text>
                          </View>
                        </AnimatedGaugeProgress>
                      </View>

                      <View
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                      >
                        <AnimatedGaugeProgress
                          size={200}
                          width={15}
                          fill={this.state.porcentage}
                          rotation={90}
                          cropDegree={90}
                          tintColor="#B27C15"
                          delay={0}
                          backgroundColor="#A44105"
                          stroke={[2, 2]} //For a equaly dashed line
                          strokeCap="circle"
                        >
                          <View style={styles.textView}>
                            <Text style={commonStyles.textTitle}>
                              Coca Cola
                            </Text>
                          </View>
                        </AnimatedGaugeProgress>
                      </View>

                      <View
                        style={{
                          height: 200,
                          width: deviceWidth,
                          alignItems: "center"
                        }}
                      >
                        <AnimatedGaugeProgress
                          size={200}
                          width={15}
                          fill={graphValue}
                          rotation={90}
                          cropDegree={90}
                          tintColor="#B27C15"
                          delay={0}
                          backgroundColor="#A44105"
                          stroke={[2, 2]} //For a equaly dashed line
                          strokeCap="circle"
                        >
                          <View style={styles.textView}>
                            <Text style={commonStyles.textTitle}>Wiskey</Text>
                          </View>
                        </AnimatedGaugeProgress>
                      </View>
                    </ScrollView>
                  </CardItem>
                </Card>
              </View>
            </Content>
            <Footer >
              <FooterTab>
                <Button 
                  style={{ backgroundColor: "#B27C15" }}
                  vertical
                  active
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <Icon active name="home" />
                  <Text>Home</Text>
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
  textView: {
    position: "absolute",
    top: textOffset,
    left: textOffset,
    width: textWidth,
    height: textHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 20
  }
});