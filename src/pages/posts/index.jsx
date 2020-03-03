import {Component} from '@tarojs/taro'
import {Text, View} from "@tarojs/components"
import moment from "moment"
import './index.scss'
import post from "../../api/post"
import cons from "../../config/cons"

const parser = require('../../components/towxml/index')
const md = require('../../components/towxml/parse/markdown/index')

class Posts extends Component {

  state = {
    posts: {
      categories: [],
      commentCount: null,
      createFrom: null,
      createTime: null,
      disallowComment: null,
      editTime: null,
      formatContent: null,
      id: null,
      likes: null,
      originalContent: null,
      tags: [],
      title: '',
      topPriority: null,
      updateTime: null,
      url: null,
      visits: 0
    }
  }

  // 页面加载事件
  componentWillMount() {
    this.loadPost()
  }

  componentDidUpdate() {
  }

  config = {
    // 定义需要引入的第三方组件
    usingComponents: {
      'towxml': '../../components/towxml/towxml' // 书写第三方组件的相对路径
    }
  }

  wxmlTagATap(e) {
    console.log(e)
  }

  loadPost() {
    post.info(this.$router.params.id).then(res => {
      this.setState({
        posts: res.data
      })
      Taro.setNavigationBarTitle({
        title: res.data.title
      })
    }).catch(() => {
    })
  }

  render() {
    const {posts} = this.state
    let content = null
    if (process.env.TARO_ENV !== 'h5') {
      content = parser(posts.originalContent || '', 'markdown', {
        events: {
          tap: (item) => {
            if (item.tag === 'img' && item.attr.src) {
              Taro.previewImage({
                urls: [item.attr.src]
              }).then(() => {
              }).catch(() => {
              })
            } else if (item.tag === 'navigator') {
              Taro.setClipboardData({data: item.attr.href}).then(() => {
                Taro.showToast({
                  title: "链接已复制"
                }).then(() => {
                })
              })
            }
          }
        }
      })
    }
    return (
      <View className='at-article'>
        <View className='article_title'>
          {posts.title}
        </View>
        <View className='at-article__info'>
          {moment(posts.createTime).format('YYYY-MM-DD')}<Text className='article-author'>{cons.blogName}</Text>
        </View>
        <View className='at-article__content'>
          {process.env.TARO_ENV !== 'h5' ? <towxml nodes={content} /> : md(posts.originalContent || '')}
        </View>
      </View>
    )
  }
}

export default Posts