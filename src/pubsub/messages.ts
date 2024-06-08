import { Data, Types } from "effect";

export type Message = Data.TaggedEnum<{
  Foo: { value: string };
  Bar: { value: number };
}>;

export const Message = Data.taggedEnum<Message>();

export type MessageType = Types.Tags<Message>;

export type MessageTypeToMessage = {
  [key in Types.ExtractTag<Message, Message["_tag"]>["_tag"]]: Types.ExtractTag<
    Message,
    key
  >;
};

export function isMessageType<T extends MessageType>(
  message: Message,
  messageType: T,
): message is MessageTypeToMessage[T] {
  return message._tag === messageType;
}
