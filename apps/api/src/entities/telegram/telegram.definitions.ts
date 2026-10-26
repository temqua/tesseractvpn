export type SendMessageBody = {
  business_connection_id?: string;
  chat_id: number | string;
  message_thread_id?: number;
  direct_messages_topic_id?: number;
  text: string;
  parse_mode?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  link_preview_options?: object;
  entities?: object[];
  ephemeral_message_parameters?: object;
  suggested_post_parameters?: object;
  reply_parameters?: object;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined;
};

export type SendMessageParams = Partial<
  Omit<SendMessageBody, 'chat_id' | 'text'>
>;

interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  is_persistent?: boolean | undefined;
  resize_keyboard?: boolean | undefined;
  one_time_keyboard?: boolean | undefined;
  input_field_placeholder?: string | undefined;
  selective?: boolean | undefined;
}

interface KeyboardButton {
  text: string;
  request_user?: KeyboardButtonRequestUser | undefined;
  request_chat?: KeyboardButtonRequestChat | undefined;
  request_contact?: boolean | undefined;
  request_location?: boolean | undefined;
  request_poll?: KeyboardButtonPollType;
  web_app?: WebAppInfo;
}

interface KeyboardButtonRequestUser {
  request_id: number;
  user_is_bot?: boolean | undefined;
  user_is_premium?: boolean | undefined;
}

interface WebAppInfo {
  url: string;
}

interface KeyboardButtonRequestChat {
  request_id: number;
  chat_is_channel: boolean;
  chat_is_forum?: boolean | undefined;
  chat_has_username?: boolean | undefined;
  chat_is_created?: boolean | undefined;
  user_administrator_rights?: boolean | undefined;
  bot_administrator_rights?: boolean | undefined;
  bot_is_member?: boolean | undefined;
}

interface KeyboardButtonPollType {
  type: PollType;
}

type PollType = 'regular' | 'quiz';

interface ReplyKeyboardRemove {
  remove_keyboard: boolean;
  selective?: boolean | undefined;
}

interface ForceReply {
  force_reply: boolean;
  input_field_placeholder?: string | undefined;
  selective?: boolean | undefined;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string | undefined;
  callback_data?: string | undefined;
  web_app?: WebAppInfo;
  login_url?: LoginUrl | undefined;
  switch_inline_query?: string | undefined;
  switch_inline_query_current_chat?: string | undefined;
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat | undefined;
  copy_text?: CopyTextButton | undefined;
  callback_game?: CallbackGame | undefined;
  pay?: boolean | undefined;
}

interface LoginUrl {
  url: string;
  forward_text?: string | undefined;
  bot_username?: string | undefined;
  request_write_access?: boolean | undefined;
}

interface CopyTextButton {
  text: string;
}

type CallbackGame = object;

interface SwitchInlineQueryChosenChat {
  query: string;
  allow_user_chats?: boolean | undefined;
  allow_bot_chats?: boolean | undefined;
  allow_group_chats?: boolean | undefined;
  allow_channel_chats?: boolean | undefined;
}
