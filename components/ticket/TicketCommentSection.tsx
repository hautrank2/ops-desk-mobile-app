import { ticketCommentApis } from "@/apis/ticket-comment";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { LOCAL_KEYS } from "@/constants/local";
import { TicketCommentModel } from "@/types";
import { getFileUrl } from "@/utils/file";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import {
  CornerDownRight,
  MessageSquare,
  Paperclip,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Safe Pure-JS Base64 Decoder
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Decode = (input: string): string => {
  const str = input.replace(/=+$/, "");
  let output = "";
  if (str.length % 4 === 1) {
    throw new Error("Invalid base64 length");
  }
  for (let bc = 0, bs = 0, buffer, idx = 0; idx < str.length; idx++) {
    const char = str.charAt(idx);
    const pos = chars.indexOf(char);
    if (pos === -1) continue;
    buffer = bc % 4 ? (buffer ?? 0) * 64 + pos : pos;
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (buffer >> ((-2 * bc) & 6)));
    }
  }
  return output;
};

const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_KEYS.TOKEN);
    if (!raw) return null;
    let token = raw;
    try {
      const parsed = JSON.parse(raw);
      token = parsed.token ?? raw;
    } catch {}
    const payloadPart = token.split(".")[1];
    const decoded = base64Decode(payloadPart);
    const payload = JSON.parse(decoded);
    return payload.userId || null;
  } catch (error) {
    console.error("Decode JWT failed", error);
    return null;
  }
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return dateStr;
  }
};

type CommentItemProps = {
  comment: TicketCommentModel;
  currentUserId: string | null;
  onReply: (
    parentId: string,
    content: string,
    images: FileAsset[],
  ) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onEditImages: (
    commentId: string,
    keepUrls: string[],
    images: FileAsset[],
  ) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

type FileAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export const TicketCommentSection = ({ ticketId }: { ticketId: string }) => {
  const toast = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Input states
  const [rootContent, setRootContent] = useState("");
  const [rootImages, setRootImages] = useState<FileAsset[]>([]);

  useEffect(() => {
    getUserIdFromToken().then(setCurrentUserId);
  }, []);

  const {
    data: comments = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ticket-comments", ticketId],
    queryFn: () => ticketCommentApis.getList(ticketId),
  });

  const showToast = useCallback(
    (action: "success" | "error", title: string, description: string) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: action === "success" ? "top" : "bottom",
        duration: 3000,
        render: ({ id: tid }) => (
          <Toast nativeID={"toast-" + tid} action={action} variant="solid">
            <VStack space="xs">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{description}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    },
    [toast],
  );

  const createMutation = useMutation({
    mutationFn: (args: {
      content: string;
      parentId?: string;
      images?: FileAsset[];
    }) =>
      ticketCommentApis.create({
        ticketId,
        content: args.content,
        parentId: args.parentId,
        images: args.images,
      }),
    onSuccess: () => {
      refetch();
      showToast("success", "Success", "Comment posted.");
    },
    onError: (error) => {
      showToast("error", "Error", error.message || "Failed to post comment.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => ticketCommentApis.update(commentId, { content }),
    onSuccess: () => {
      refetch();
    },
  });

  const updateImagesMutation = useMutation({
    mutationFn: ({
      commentId,
      keepUrls,
      images,
    }: {
      commentId: string;
      keepUrls: string[];
      images: FileAsset[];
    }) => ticketCommentApis.updateImages(commentId, { keepUrls, images }),
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => ticketCommentApis.remove(commentId),
    onSuccess: () => {
      refetch();
      showToast("success", "Deleted", "Comment removed.");
    },
  });

  const handlePostRoot = async () => {
    if (!rootContent.trim() && rootImages.length === 0) return;
    await createMutation.mutateAsync({
      content: rootContent.trim(),
      images: rootImages,
    });
    setRootContent("");
    setRootImages([]);
  };

  const handlePickRootImages = async () => {
    if (rootImages.length >= 5) {
      Alert.alert("Limit reached", "Max 5 photos per comment.");
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const remaining = 5 - rootImages.length;
      const picked = result.assets.slice(0, remaining).map((a) => ({
        uri: a.uri,
        fileName: a.fileName,
        mimeType: a.mimeType,
      }));
      setRootImages((prev) => [...prev, ...picked]);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="small" className="py-4 text-typography-500" />
    );
  }

  return (
    <VStack space="md" className="mt-4 border-t border-outline-100 pt-4">
      <Text className="text-base font-bold text-typography-800">
        Comments ({comments.length})
      </Text>
      {/* Root form */}
      <View className="bg-background-50 p-3 rounded-lg border border-outline-200">
        <Input className="bg-background-0 min-h-[60px] h-auto items-start p-2 border-outline-200">
          <InputField
            multiline
            placeholder="Write a comment..."
            value={rootContent}
            onChangeText={setRootContent}
            textAlignVertical="top"
            className="text-sm text-typography-800 h-auto"
          />
        </Input>

        {rootImages.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {rootImages.map((img, idx) => (
              <View
                key={idx}
                className="relative w-12 h-12 rounded border border-outline-200 overflow-hidden bg-background-0"
              >
                <Image
                  source={{ uri: img.uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute -top-1 -right-1 bg-background-500 rounded-full p-0.5"
                  onPress={() =>
                    setRootImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <X size={10} className="text-typography-0" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row justify-between items-center mt-2.5">
          <Button variant="outline" size="xs" onPress={handlePickRootImages}>
            <ButtonIcon as={Paperclip} className="mr-1" />
            <ButtonText>Attach ({rootImages.length}/5)</ButtonText>
          </Button>

          <Button
            size="xs"
            onPress={handlePostRoot}
            isDisabled={createMutation.isPending}
          >
            {createMutation.isPending && <ButtonSpinner className="mr-1" />}
            <ButtonIcon as={Send} className="mr-1" />
            <ButtonText>Send</ButtonText>
          </Button>
        </View>
      </View>
      {/* Threaded List */}
      <View className="space-y-4">
        {comments.map((comment) => (
          <CommentItemNode
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            onReply={async (pid, content, imgs) => {
              await createMutation.mutateAsync({
                content,
                parentId: pid,
                images: imgs,
              });
            }}
            onEdit={async (cid, content) => {
              await updateMutation.mutateAsync({ commentId: cid, content });
            }}
            onEditImages={async (cid, keepUrls, imgs) => {
              await updateImagesMutation.mutateAsync({
                commentId: cid,
                keepUrls,
                images: imgs,
              });
            }}
            onDelete={async (cid) => {
              Alert.alert(
                "Confirm Delete",
                "Are you sure you want to delete this comment?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteMutation.mutate(cid),
                  },
                ],
              );
            }}
          />
        ))}
      </View>
    </VStack>
  );
};

/* --- CommentItemNode Sub-Component --- */
const CommentItemNode = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onEditImages,
  onDelete,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [replyImages, setReplyImages] = useState<FileAsset[]>([]);

  const [editContent, setEditContent] = useState(comment.content);
  const [editKeepUrls, setEditKeepUrls] = useState<string[]>(
    comment.imgUrls || [],
  );
  const [editImages, setEditImages] = useState<FileAsset[]>([]);

  const [loading, setLoading] = useState(false);

  const createdByUser =
    typeof comment.createdBy === "object" ? comment.createdBy : null;
  const createdById =
    typeof comment.createdBy === "object"
      ? comment.createdBy._id
      : comment.createdBy;
  const authorName = createdByUser?.name || createdByUser?.username || "User";
  const isOwner = currentUserId === createdById;

  const handleReply = async () => {
    if (!replyContent.trim() && replyImages.length === 0) return;
    setLoading(true);
    try {
      await onReply(comment._id, replyContent.trim(), replyImages);
      setReplyContent("");
      setReplyImages([]);
      setIsReplying(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      if (editContent.trim() !== comment.content) {
        await onEdit(comment._id, editContent.trim());
      }
      const imagesChanged =
        editKeepUrls.length !== comment.imgUrls.length || editImages.length > 0;
      if (imagesChanged) {
        await onEditImages(comment._id, editKeepUrls, editImages);
      }
      setEditImages([]);
      setIsEditing(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handlePickReplyImages = async () => {
    if (replyImages.length >= 5) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const remaining = 5 - replyImages.length;
      const picked = result.assets.slice(0, remaining).map((a) => ({
        uri: a.uri,
        fileName: a.fileName,
        mimeType: a.mimeType,
      }));
      setReplyImages((prev) => [...prev, ...picked]);
    }
  };

  const handlePickEditImages = async () => {
    const total = editKeepUrls.length + editImages.length;
    if (total >= 5) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const remaining = 5 - total;
      const picked = result.assets.slice(0, remaining).map((a) => ({
        uri: a.uri,
        fileName: a.fileName,
        mimeType: a.mimeType,
      }));
      setEditImages((prev) => [...prev, ...picked]);
    }
  };

  return (
    <View className="flex-row mt-3 gap-2">
      {/* Left side: Avatar */}
      <View className="items-center">
        <View className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 items-center justify-center">
          <Text className="text-primary-700 text-xs font-bold font-roboto">
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        {comment.replies && comment.replies.length > 0 && (
          <View className="w-[1px] flex-grow bg-background-200 mt-1" />
        )}
      </View>

      {/* Right side: Body */}
      <View className="flex-1 space-y-1.5">
        <View className="bg-background-50 p-3 rounded-lg border border-outline-100 h-auto">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs font-bold text-typography-800 font-roboto">
                {authorName}
              </Text>
              <Text className="text-[10px] text-typography-400 font-mono">
                {formatDate(comment.createdAt)}
              </Text>
              {comment.updatedBy && (
                <Text className="text-[10px] text-typography-400 italic font-roboto">
                  (edited)
                </Text>
              )}
            </View>

            {isOwner && !isEditing && (
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Pencil
                    size={12}
                    className="text-typography-500 hover:text-typography-800"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(comment._id)}>
                  <Trash2
                    size={12}
                    className="text-typography-500 hover:text-error-600"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <VStack space="sm">
              <Input className="bg-background-0 min-h-[50px] h-auto items-start p-1.5 border-outline-200">
                <InputField
                  multiline
                  value={editContent}
                  onChangeText={setEditContent}
                  textAlignVertical="top"
                  className="text-xs text-typography-800 h-auto"
                />
              </Input>

              {/* Edit images */}
              <View className="flex-row flex-wrap gap-2">
                {editKeepUrls.map((url, idx) => (
                  <View
                    key={idx}
                    className="relative w-10 h-10 border border-outline-200 rounded"
                  >
                    <Image
                      source={{ uri: getFileUrl(url) }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -top-1 -right-1 bg-error-600 rounded-full p-0.5"
                      onPress={() =>
                        setEditKeepUrls((prev) => prev.filter((u) => u !== url))
                      }
                    >
                      <X size={8} className="text-typography-0" />
                    </TouchableOpacity>
                  </View>
                ))}

                {editImages.map((img, idx) => (
                  <View
                    key={idx}
                    className="relative w-10 h-10 border border-success-300 rounded"
                  >
                    <Image
                      source={{ uri: img.uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -top-1 -right-1 bg-error-600 rounded-full p-0.5"
                      onPress={() =>
                        setEditImages((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      <X size={8} className="text-typography-0" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center">
                <Button
                  variant="outline"
                  size="xs"
                  onPress={handlePickEditImages}
                  isDisabled={editKeepUrls.length + editImages.length >= 5}
                >
                  <ButtonIcon as={Paperclip} className="mr-1" />
                  <ButtonText>Photo</ButtonText>
                </Button>

                <View className="flex-row gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-7"
                    onPress={() => setIsEditing(false)}
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button
                    size="xs"
                    className="h-7"
                    onPress={handleEditSubmit}
                    isDisabled={loading}
                  >
                    {loading && <ButtonSpinner className="mr-1" />}
                    <ButtonText>Save</ButtonText>
                  </Button>
                </View>
              </View>
            </VStack>
          ) : (
            <VStack space="xs">
              <Text className="text-sm text-typography-800 leading-normal font-roboto">
                {comment.content}
              </Text>

              {comment.imgUrls && comment.imgUrls.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5 pt-1.5">
                  {comment.imgUrls.map((url, i) => (
                    <Image
                      key={i}
                      source={{ uri: getFileUrl(url) }}
                      className="w-12 h-12 rounded border border-outline-100"
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}

              <TouchableOpacity
                className="flex-row items-center pt-2 gap-1"
                onPress={() => setIsReplying((r) => !r)}
              >
                <MessageSquare size={12} className="text-typography-400" />
                <Text className="text-[11px] text-typography-400 font-medium font-roboto">
                  Reply
                </Text>
              </TouchableOpacity>
            </VStack>
          )}
        </View>

        {/* Reply form */}
        {isReplying && (
          <View className="flex-row items-start gap-1.5 pl-2 pt-1">
            <CornerDownRight size={12} className="text-typography-400 mt-2" />
            <View className="flex-1 bg-background-50 p-2.5 rounded-lg border border-outline-200">
              <Input className="bg-background-0 min-h-[40px] h-auto items-start p-1.5 border-outline-200">
                <InputField
                  multiline
                  placeholder={`Reply to ${authorName}...`}
                  value={replyContent}
                  onChangeText={setReplyContent}
                  textAlignVertical="top"
                  className="text-xs text-typography-800 h-auto"
                />
              </Input>

              {replyImages.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5 mt-1.5">
                  {replyImages.map((img, idx) => (
                    <View
                      key={idx}
                      className="relative w-8 h-8 rounded border overflow-hidden bg-background-0"
                    >
                      <Image
                        source={{ uri: img.uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute -top-1 -right-1 bg-background-500 rounded-full p-0.5"
                        onPress={() =>
                          setReplyImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        <X size={8} className="text-typography-0" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row justify-between items-center mt-2">
                <Button
                  variant="outline"
                  size="xs"
                  className="h-6"
                  onPress={handlePickReplyImages}
                >
                  <ButtonIcon as={Paperclip} className="mr-1" />
                  <ButtonText>Photo</ButtonText>
                </Button>

                <View className="flex-row gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-6"
                    onPress={() => {
                      setIsReplying(false);
                      setReplyContent("");
                      setReplyImages([]);
                    }}
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button
                    size="xs"
                    className="h-6"
                    onPress={handleReply}
                    isDisabled={loading}
                  >
                    {loading && <ButtonSpinner className="mr-1" />}
                    <ButtonText>Send</ButtonText>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <View className="pl-4 border-l border-outline-200 mt-2 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItemNode
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onEditImages={onEditImages}
                onDelete={onDelete}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
