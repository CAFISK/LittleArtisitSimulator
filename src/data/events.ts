import type { GameEvent, GameState } from '../types'

// Helper: random integer in [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ===== Random Events =====

export const RANDOM_EVENTS: Array<{
  event: GameEvent
  condition: (state: GameState) => boolean
  probability: number
}> = [
  // === Positive Events ===
  {
    condition: (s) => s.popularity > 50 && s.skill > 40,
    probability: 0.15,
    event: {
      id: 'viral_post',
      title: '作品突然爆了！',
      icon: '🎉',
      description: '你发的一张图突然被疯狂转发，通知栏都要炸了！粉丝数蹭蹭往上涨！',
      choices: [
        {
          text: 'A. 趁热打铁，赶紧再产出几张！',
          effects: [
            { attr: 'fans', value: 2000 },
            { attr: 'popularity', value: 20 },
            { attr: 'stamina', value: -30 },
            { attr: 'mental', value: -10 },
          ],
          resultText: '你连续产出了好几张图，热度持续攀升！但也累坏了...'
        },
        {
          text: 'B. 低调发展，稳扎稳打',
          effects: [
            { attr: 'fans', value: 1000 },
            { attr: 'popularity', value: 10 },
            { attr: 'mental', value: 5 },
          ],
          resultText: '你选择了低调，虽然没有最大化热度，但心态很稳~'
        }
      ]
    }
  },
  {
    condition: (s) => s.fans > 1000,
    probability: 0.12,
    event: {
      id: 'big_v_repost',
      title: '大V转发了你的图！',
      icon: '💌',
      description: '一个拥有百万粉丝的大V转发了你的作品，还配了一句"太好看了吧！"',
      choices: [
        {
          text: 'A. 感谢互动，礼貌回复',
          effects: [
            { attr: 'fans', value: 800 },
            { attr: 'social', value: 10 },
            { attr: 'popularity', value: 15 },
          ],
          resultText: '你礼貌地感谢了大V，给粉丝留下了好印象~'
        },
        {
          text: 'B. 借机宣传自己的约稿信息',
          effects: [
            { attr: 'fans', value: 500 },
            { attr: 'money', value: 1000 },
            { attr: 'popularity', value: 10 },
          ],
          resultText: '趁着热度宣传了约稿，很快就接到了几单！'
        }
      ]
    }
  },
  {
    condition: (s) => s.skill > 60 && s.fans > 5000,
    probability: 0.08,
    event: {
      id: 'game_company_collab',
      title: '游戏公司邀请合作！',
      icon: '📧',
      description: '一家游戏公司发来邮件，想邀请你为他们的新游戏画角色立绘！报酬丰厚但时间很紧。',
      choices: [
        {
          text: 'A. 接受！这是难得的机会！',
          effects: [
            { attr: 'money', value: 8000 },
            { attr: 'skill', value: 5 },
            { attr: 'mental', value: -25 },
            { attr: 'stamina', value: -40 },
            { attr: 'reputation', value: 10 },
          ],
          resultText: '你拼命赶工完成了合作，虽然累但收获满满！简历上又多了一笔！'
        },
        {
          text: 'B. 婉拒，目前状态不太好',
          effects: [
            { attr: 'mental', value: 5 },
          ],
          resultText: '你婉拒了邀请，虽然有点可惜，但身体是革命的本钱。'
        }
      ]
    }
  },
  {
    condition: (s) => s.fans > 3000 && s.social > 50,
    probability: 0.06,
    event: {
      id: 'fan_gift',
      title: '粉丝送了数位板！',
      icon: '🎁',
      description: '一位忠实粉丝给你寄了一块新的数位板！"大大加油！一直支持你！"',
      choices: [
        {
          text: '感动收下，发微博感谢',
          effects: [
            { attr: 'skill', value: 3 },
            { attr: 'mental', value: 15 },
            { attr: 'fans', value: 200 },
            { attr: 'social', value: 5 },
          ],
          resultText: '新数位板手感超棒！画画效率提升了！感动哭了 QAQ'
        }
      ]
    }
  },

  // === Negative Events ===
  {
    condition: (s) => s.fans > 2000,
    probability: 0.12,
    event: {
      id: 'art_theft',
      title: '作品被盗图了！',
      icon: '🗑️',
      description: '你发现有人把你的图去掉水印发到了其他平台，还标注了"原创"...',
      choices: [
        {
          text: 'A. 花时间精力维权',
          effects: [
            { attr: 'stamina', value: -20 },
            { attr: 'mental', value: -10 },
            { attr: 'reputation', value: 5 },
            { attr: 'fans', value: 300 },
          ],
          resultText: '经过一番维权，对方终于删除了盗图。虽然累，但维护了自己的权益。'
        },
        {
          text: 'B. 发微博控诉',
          effects: [
            { attr: 'mental', value: -5 },
            { attr: 'fans', value: 100 },
            { attr: 'popularity', value: 5 },
          ],
          resultText: '发了一条控诉微博，粉丝们纷纷声援，但盗图者并没有道歉...'
        },
        {
          text: 'C. 算了，不想浪费时间',
          effects: [
            { attr: 'mental', value: -15 },
          ],
          resultText: '虽然选择了放弃，但心里还是很不舒服...'
        }
      ]
    }
  },
  {
    condition: (s) => s.haters > 20,
    probability: 0.1,
    event: {
      id: 'cyberbully',
      title: '被网暴了...',
      icon: '💀',
      description: '不知道为什么，突然有一群人涌进你的评论区疯狂攻击你的画...',
      choices: [
        {
          text: 'A. 正面回应，解释清楚',
          effects: [
            { attr: 'mental', value: -20 },
            { attr: 'haters', value: -5 },
            { attr: 'fans', value: 100 },
          ],
          resultText: '你冷静地回应了质疑，一部分人理解了你，但还是很伤心...'
        },
        {
          text: 'B. 关闭评论，躲几天',
          effects: [
            { attr: 'mental', value: -10 },
            { attr: 'popularity', value: -10 },
          ],
          resultText: '你关闭了评论区，暂时远离了网络。世界安静了...'
        },
        {
          text: 'C. 发长文回应',
          effects: [
            { attr: 'mental', value: -15 },
            { attr: 'popularity', value: 10 },
            { attr: 'fans', value: -100 },
            { attr: 'haters', value: 10 },
          ],
          resultText: '长文引发了更大的争议，有人支持有人反对，事情越闹越大了...'
        }
      ]
    }
  },
  {
    condition: (s) => s.stamina < 30,
    probability: 0.2,
    event: {
      id: 'sick',
      title: '生病了...',
      icon: '🤒',
      description: '连续高强度工作，你的身体终于扛不住了。发烧39度，头昏脑涨...',
      choices: [
        {
          text: '乖乖去看医生，好好休息',
          effects: [
            { attr: 'money', value: -500 },
            { attr: 'stamina', value: 50 },
            { attr: 'mental', value: -5 },
          ],
          resultText: '去医院看了医生，花了500块。医生说要注意休息，不能再这么拼了。'
        }
      ]
    }
  },
  {
    condition: (s) => s.inspiration < 15,
    probability: 0.2,
    event: {
      id: 'creative_block',
      title: '创作瓶颈...',
      icon: '📉',
      description: '盯着空白的画布发呆了一个小时，脑子里一片空白。画什么都觉得不对...',
      choices: [
        {
          text: 'A. 强迫自己画下去',
          effects: [
            { attr: 'mental', value: -15 },
            { attr: 'skill', value: 1 },
          ],
          resultText: '硬着头皮画了一张，虽然不满意，但至少没有停下来。'
        },
        {
          text: 'B. 放下画笔，出去走走',
          effects: [
            { attr: 'inspiration', value: 20 },
            { attr: 'mental', value: 10 },
          ],
          resultText: '出去走了一圈，看到了很多有趣的东西，灵感慢慢回来了~'
        }
      ]
    }
  },
  {
    condition: () => Math.random() < 0.5,
    probability: 0.05,
    event: {
      id: 'rent_increase',
      title: '房租涨了！',
      icon: '💸',
      description: '房东发来消息："下个月开始房租涨200哦~" 你看着余额陷入了沉思...',
      choices: [
        {
          text: '忍了，继续住',
          effects: [
            { attr: 'money', value: -200 },
            { attr: 'mental', value: -10 },
          ],
          resultText: '虽然心在滴血，但搬家更麻烦...忍了吧。'
        },
        {
          text: '和房东讨价还价',
          effects: [
            { attr: 'mental', value: -5 },
          ],
          resultText: '和房东软磨硬泡了半天，最终只涨了100块。也算是小胜利吧。'
        }
      ]
    }
  },
  {
    condition: () => true,
    probability: 0.08,
    event: {
      id: 'controversial_post',
      title: '发了争议言论',
      icon: '🐦',
      description: '你随手发了一条关于画圈的吐槽，没想到引发了巨大争议...',
      choices: [
        {
          text: 'A. 赶紧道歉删除',
          effects: [
            { attr: 'mental', value: -10 },
            { attr: 'haters', value: 5 },
          ],
          resultText: '你迅速删除了那条动态并道歉，但截图已经传开了...'
        },
        {
          text: 'B. 坚持己见',
          effects: [
            { attr: 'mental', value: -5 },
            { attr: 'haters', value: 15 },
            { attr: 'fans', value: 200 },
            { attr: 'popularity', value: 10 },
          ],
          resultText: '你选择坚持自己的观点，虽然得罪了一些人，但也获得了一批支持者。'
        },
        {
          text: 'C. 装死，假装什么都没发生',
          effects: [
            { attr: 'haters', value: 8 },
            { attr: 'popularity', value: -5 },
          ],
          resultText: '你选择沉默，风波慢慢过去了...但总感觉有人在背后议论你。'
        }
      ]
    }
  },
  // More positive events
  {
    condition: (s) => s.skill > 70,
    probability: 0.06,
    event: {
      id: 'art_book',
      title: '作品入选画集！',
      icon: '🏆',
      description: '一家出版社联系你，想把你的作品收录进年度画集！',
      choices: [
        {
          text: 'A. 同意收录',
          effects: [
            { attr: 'fans', value: 500 },
            { attr: 'reputation', value: 10 },
            { attr: 'mental', value: 10 },
          ],
          resultText: '你的作品被收录进了画集，在画圈里又多了一份认可！'
        },
        {
          text: 'B. 要求更高的稿费',
          effects: [
            { attr: 'money', value: 3000 },
            { attr: 'reputation', value: 5 },
          ],
          resultText: '经过谈判，出版社同意支付更高的稿费。商业头脑在线！'
        }
      ]
    }
  },
  {
    condition: (s) => s.mental < 40,
    probability: 0.15,
    event: {
      id: 'friend_support',
      title: '朋友的关心',
      icon: '💝',
      description: '画师朋友注意到你最近状态不好，约你出来吃饭聊天。"最近怎么了？有什么可以帮忙的吗？"',
      choices: [
        {
          text: '和朋友倾诉一番',
          effects: [
            { attr: 'mental', value: 20 },
            { attr: 'social', value: 5 },
            { attr: 'inspiration', value: 10 },
          ],
          resultText: '和朋友聊了很久，心里舒服多了。有朋友真好 😊'
        },
        {
          text: '说没事，强撑着笑笑',
          effects: [
            { attr: 'mental', value: 5 },
            { attr: 'social', value: 2 },
          ],
          resultText: '虽然没有说出口，但朋友的关心还是让你感到温暖。'
        }
      ]
    }
  },
]

// ===== Story Events (triggered by month) =====

export const STORY_EVENTS: Array<{
  month: number
  event: GameEvent
}> = [
  {
    month: 3,
    event: {
      id: 'first_commission',
      title: '第一次约稿！',
      icon: '📩',
      description: '有人私信你："大大，请问可以约稿吗？想要一张头像~" 这是你收到的第一条约稿私信！虽然对方预算不高，但这是一个开始！',
      choices: [
        {
          text: 'A. 接！虽然便宜但是第一单！',
          effects: [
            { attr: 'money', value: 200 },
            { attr: 'mental', value: 10 },
            { attr: 'reputation', value: 5 },
            { attr: 'fans', value: 20 },
          ],
          resultText: '你认真画完了第一单约稿，对方非常满意！还发了好评到朋友圈！虽然只赚了200块，但成就感满满！'
        },
        {
          text: 'B. 拒绝，价格太低了',
          effects: [
            { attr: 'mental', value: -5 },
          ],
          resultText: '你拒绝了这单约稿。也许等画技更好了再开约稿也不迟...'
        }
      ]
    }
  },
  {
    month: 5,
    event: {
      id: 'circle_drama',
      title: '画师圈撕逼事件！',
      icon: '⚡',
      description: '画圈爆发了一场大撕逼！两位知名画师因为"抄袭"问题互相指责，整个圈子都在站队。你的时间线被刷屏了...',
      choices: [
        {
          text: 'A. 站A方（指控抄袭的一方）',
          effects: [
            { attr: 'fans', value: 300 },
            { attr: 'haters', value: 10 },
            { attr: 'social', value: -5 },
            { attr: 'popularity', value: 10 },
          ],
          resultText: '你公开支持了A方，获得了一些支持者，但也被B方的粉丝记恨了...'
        },
        {
          text: 'B. 站B方（被指控的一方）',
          effects: [
            { attr: 'fans', value: 200 },
            { attr: 'haters', value: 15 },
            { attr: 'social', value: -5 },
            { attr: 'popularity', value: 8 },
          ],
          resultText: '你选择支持B方，认为证据不足。但A方的支持者开始攻击你...'
        },
        {
          text: 'C. 保持中立，不参与',
          effects: [
            { attr: 'mental', value: 5 },
            { attr: 'social', value: 5 },
          ],
          resultText: '你选择了沉默，虽然有人说你"骑墙"，但至少没有卷入风波。'
        }
      ]
    }
  },
  {
    month: 7,
    event: {
      id: 'summer_convention',
      title: '夏日漫展来了！',
      icon: '🏖️',
      description: '一年一度的夏日漫展即将开幕！你可以选择参加摆摊卖周边，但需要提前准备和投入资金。',
      choices: [
        {
          text: 'A. 参加！准备摊位和周边',
          effects: [
            { attr: 'money', value: -3000 },
            { attr: 'stamina', value: -40 },
            { attr: 'fans', value: 1500 },
            { attr: 'social', value: 15 },
            { attr: 'mental', value: 10 },
          ],
          resultText: '漫展摆摊超级累但超级开心！见到了很多喜欢你作品的粉丝，还认识了不少画师朋友！最终收入扣除成本后...'
        },
        {
          text: 'B. 以观众身份去逛逛',
          effects: [
            { attr: 'money', value: -500 },
            { attr: 'inspiration', value: 20 },
            { attr: 'mental', value: 15 },
            { attr: 'social', value: 5 },
          ],
          resultText: '作为观众逛了一天漫展，买了一堆周边，看到了很多厉害的作品，灵感爆棚！'
        },
        {
          text: 'C. 不去了，在家画画',
          effects: [
            { attr: 'skill', value: 3 },
          ],
          resultText: '你选择在家安静画画。看着朋友圈里大家在漫展的照片，有一点点羡慕...'
        }
      ]
    }
  },
  {
    month: 9,
    event: {
      id: 'bottleneck',
      title: '瓶颈期来了...',
      icon: '😰',
      description: '最近画什么都不满意，总觉得自己的画没有进步。看着别人的作品越来越好，焦虑感越来越强...',
      choices: [
        {
          text: 'A. 咬牙坚持，大量练习',
          effects: [
            { attr: 'skill', value: 5 },
            { attr: 'mental', value: -20 },
            { attr: 'stamina', value: -30 },
          ],
          resultText: '你拼命练习了一个月，虽然过程很痛苦，但画技确实有了突破！'
        },
        {
          text: 'B. 换个方向，尝试新画风',
          effects: [
            { attr: 'skill', value: 2 },
            { attr: 'inspiration', value: 25 },
            { attr: 'mental', value: 5 },
          ],
          resultText: '你尝试了完全不同的画风，虽然还不熟练，但找到了新的乐趣！'
        },
        {
          text: 'C. 给自己放个假',
          effects: [
            { attr: 'mental', value: 20 },
            { attr: 'inspiration', value: 15 },
            { attr: 'popularity', value: -5 },
          ],
          resultText: '你给自己放了几天假，出去旅行了一趟。回来后感觉整个人都焕然一新！'
        }
      ]
    }
  },
  {
    month: 11,
    event: {
      id: 'year_end_opportunity',
      title: '年终大机遇！',
      icon: '🌟',
      description: '一个大型项目找上了你！这是一个知名IP的官方合作机会，如果能接下来，将是你职业生涯的重要里程碑！',
      choices: [
        {
          text: 'A. 全力以赴接下来！',
          effects: [
            { attr: 'money', value: 15000 },
            { attr: 'skill', value: 8 },
            { attr: 'fans', value: 3000 },
            { attr: 'reputation', value: 15 },
            { attr: 'mental', value: -30 },
            { attr: 'stamina', value: -50 },
          ],
          resultText: '你拼尽全力完成了这个项目！作品发布后获得了巨大反响，这是你画师生涯的高光时刻！'
        },
        {
          text: 'B. 量力而行，婉拒了',
          effects: [
            { attr: 'mental', value: 10 },
          ],
          resultText: '你评估了自己的状态后选择了婉拒。也许下次会有更好的机会。'
        }
      ]
    }
  },
]

// ===== Event Engine =====

export function checkRandomEvents(state: GameState): GameEvent | null {
  // Shuffle and check events
  const shuffled = [...RANDOM_EVENTS].sort(() => Math.random() - 0.5)

  for (const entry of shuffled) {
    if (entry.condition(state) && Math.random() < entry.probability) {
      // Don't repeat recent events
      if (!state.eventHistory.slice(-5).includes(entry.event.id)) {
        return entry.event
      }
    }
  }
  return null
}

export function checkStoryEvent(month: number, eventHistory: string[]): GameEvent | null {
  const storyEvent = STORY_EVENTS.find(e => e.month === month)
  if (storyEvent && !eventHistory.includes(storyEvent.event.id)) {
    return storyEvent.event
  }
  return null
}
