import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import classnames from 'classnames'
import "./swiperSL.scss";
export default class SwiperSL extends Component {
  static defaultProps = {
          swiperData:[
            {img:'https://pic.meetao.com/images/admin/2531edf0b7e34c299892ceace72b2c81.jpg',title:'干啥啥都行',amount:'68.55',remark:'累计收益'},
            {img:'https://pic.meetao.com/images/admin/2e71e98cf50a409ab9f04d9cb3b19de4.png',title:'吃饭第一名',amount:'68.55',remark:'参与次数'},
            {img:'https://pic.meetao.com/images/admin/bc28dfc4a9ae470e86eed8f743a3d97a.png',title:'啊啊啊啊啊',amount:'68.55',remark:'勋章数量'},
            {img:'https://pic.meetao.com/images/admin/1070701b82e8416d940c558f5fb61ad2.jpg',title:'明天放假啦',amount:'68.55',remark:'累计勋章'},
            {img:'https://pic.meetao.com/images/admin/5a454819dabd469991c62c72e348c49b.jpg',title:'哈哈哈哈哈',amount:'68.55',remark:'勋章大小'}
          ],
        }
  constructor(props) {
    super(props);
    this.state = {
      leftWidth: 246,
      cacheIndex: 0,
      cardCur: 0,
      left: 0,
      screenRate: 1,
      isMove: false,
    };
  }
  componentWillMount() {}

  componentDidMount() {
    Taro.getSystemInfo({
      success: (res) => {
        // 750除以屏幕宽度，得到转换比。因为API用的和得到的大部分的单位都是px，所以还是要转一下
        this.setState({
          screenRate: (750/res.screenWidth)
        })
      },
    })
  }

  componentWillUnmount() {

  }

  componentDidShow() {}

  componentDidHide() {}
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  swiperClick(index){
    this.setState({
      cardCur:index
    },()=>{
        // Taro.navigateTo({
        //   url: '../login/login?from=' + fromadress
        // }):""
    })
  }
  tapLeft(){
    // 0 -> 4
    let cardCur=this.state.cardCur;
    this.setState({
      cardCur: cardCur==0?4:(cardCur-1)
    })
  },
  tapRight(){
    let cardCur=this.state.cardCur;
    this.setState({
      cardCur: cardCur==4?0:(cardCur+1)
    })
  }
  touchstart(e) {
    this.setState({
      left : e.touches[0].pageX
    })
  },
  touchmove(e) {
    // 频率控制，一次移动完成后，才能进行下一次
    if (this.state.isMove) {
      return
    }
    let moveLength = (e.touches[0].pageX - this.state.left) * this.state.screenRate
    moveLength = moveLength > 60 ? 60 : moveLength
    moveLength = moveLength < -60 ? -60 : moveLength
    let rate = moveLength / 60
    if (rate == 1) {
      //从右往左滑
      this.setState({
        isMove : true
      },()=>{
        this.tapRight()
      });
    } else if (rate == -1) {
      //从左往右滑
      this.setState({
        isMove : true
      },()=>{
        this.tapLeft()
      });
    }
  },
  touchend() {
    setTimeout(() => {
      this.setState({
        isMove:false
      })
    }, 500)
  },
  render() {
    return (
      <View className="swiperSL">
        <View
          className='cardSwiper'
          onTouchstart={this.touchstart.bind(this)}
          onTouchmove={this.touchmove}
          onTouchend={this.touchend}
          >
          {this.props.swiperData.map((item,index)=>{
            return (
              <View
              onClick={this.swiperClick.bind(this, index)}
              className={classnames(this.state.cardCur==index&&'cur',((this.state.cardCur==4&&index==0)||(this.state.cardCur==0&&index==4)||this.state.cardCur+1==index||this.state.cardCur-1==index)&&'curs',((this.state.cardCur==4&&index==0)||this.state.cardCur+1==index)&&'curRight',((this.state.cardCur==0&&index==4)||this.state.cardCur-1==index)&&'curLeft',((this.state.cardCur==0&&index==3)||(this.state.cardCur==1&&index==4)||this.state.cardCur-2==index)&&'cursLt',((this.state.cardCur==3&&index==0)||(this.state.cardCur==4&&index==1)||this.state.cardCur+2==index)&&'cursRt','swiper-item')}
              style={{ 'position':'absolute','left':this.state.leftWidth + 'rpx','transform': (this.state.cardCur==0&&index==4||this.state.cardCur-1==index)?'translate(50%, 0px) translateZ(0px)':(this.state.cardCur==4&&index==0||this.state.cardCur+1==index)?'translate(-50%, 0px) translateZ(0px)':(this.state.cardCur==3&&index==0||this.state.cardCur+2==index)?'translate(-100%, 0px) translateZ(0px)':(this.state.cardCur==0&&index==3||this.state.cardCur-2==index)?'translate(100%, 0px) translateZ(0px)':'translate(0%, 0px) translateZ(0px)';}}
              key={item}>
                <View className={classnames('swiper-view','swiper-view'+index)}>
                  <Image className="header" src={item.img}></Image>
                  <View className="title">{item.title}</View>
                  <View className="amount">{item.amount}</View>
                  <View className="remark">{item.remark}</View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    );
  }
}
