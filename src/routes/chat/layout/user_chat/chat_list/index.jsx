import './style.scss'
import { DateTitle, MessageContentLeft, MessageContentRight } from './components'

export default function ChatList() {
    return (
        <div className="chat-list">
            <ul>
                <li> <DateTitle date={new Date()} /> </li>
                <li> <MessageContentLeft msg_id={'1'} msg_type={1} msg="Hello" timestamp={new Date()} edited={false} /> </li>
                <li> <MessageContentLeft msg_id={'2'} msg_type={1} msg={'Hello,\n\tyou there ? f;osdk ;jlgfds            dfdhsfhdslofkjdshf    kjsdhfkjsdhf jsdhf lds la lkjsdh fdfsdfldjs   lkdflsdjfldsjflsdfh fhdsfhkjdshfosdfhgkjosd  kjsdhfsdhfods h '} timestamp={new Date()} edited={true} /> </li>
                <li> <MessageContentRight msg_id={'3'} msg_type={1} msg="Hello" timestamp={new Date()} edited={false} /> </li>
                <li> <MessageContentRight msg_id={'4'} msg_type={1} msg={'What\'s up ? sdfsad fsdaf eef sdafsda dslkjaf jlksdajf oisdjlf jsdlkf jl;ksdj flkkjfsdlflksdfljsdhfkjsdhfkjsdhkfk h  fkdh khsdf hksdjf h'} timestamp={new Date()} edited={true} /> </li>
            </ul>
        </div>
    )
}