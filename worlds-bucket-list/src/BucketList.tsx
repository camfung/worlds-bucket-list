import { message, Button, List, Space, Spin } from "antd";
import { bucketListApi, BucketListItem, calculateScore, voteStorage, VoteType } from "./api/api";
import { CheckOutlined, CloseOutlined, DeleteOutline, DeleteOutlineTwoTone, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { ArrowDownOutlined, ArrowUpOutlined, LoadingOutlined, MinusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface BucketListProps {
  items: BucketListItem[];
  loading: boolean;
  setItems: React.Dispatch<React.SetStateAction<BucketListItem[]>>;
  fetchItems: () => Promise<void>;
}
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export const BucketList: React.FC<BucketListProps> = ({ items, loading, setItems, fetchItems }) => {
  const [admin, setAdmin] = useState(false)
  const handleVote = async (id: number, isUpvote: boolean) => {
    const votedItems = JSON.parse(localStorage.getItem('votedItems') || '{}');

    if (votedItems[id]) {
      message.warning('You have already voted on this item');
      return;
    }

    try {
      const data = bucketListApi.vote(id, isUpvote)

      setItems((prevItems: BucketListItem[]) => {

        prevItems.map(item =>
          item.id === id ? data : item
        )
        return prevItems
      });

      localStorage.setItem('votedItems', JSON.stringify({
        ...votedItems,
        [id]: isUpvote
      }));

      message.success(`Successfully ${isUpvote ? 'upvoted' : 'downvoted'}`);
      fetchItems()
    } catch (error) {
      message.error('Failed to register vote');
      console.error('Error voting:', error);
    }

  };
  const handleDelete = async (item: BucketListItem) => {
    try {
      await bucketListApi.delete(item.id)
      message.success("deleted Item")
      fetchItems()
    } catch {
      message.error("error deleteing item")
    }

  }
  useEffect(() => {
    const admin = localStorage.getItem("admin")
    if (admin) {
      setAdmin(true)
    }
  })
  return (
    <>
      {loading && (
        <Spin indicator={antIcon} tip={"Finding Everyones Wishes..."} />
      )}

      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={items}
        style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}
        renderItem={(item: BucketListItem) => {
          const voteStatus = voteStorage.hasVoted(item.id);

          return (
            <List.Item
              actions={[
                <Space>
                  <span
                    onClick={() => handleVote(item.id, true)}
                    style={{
                      cursor: 'pointer',
                      color: voteStatus.voteType === 'yes' ? '#1890ff' : // blue for yes
                        voteStatus.voteType === 'no' ? '#ff4d4f' :  // red for no
                          '#808080'                               // grey for novote
                    }}
                  >
                    <ArrowUpOutlined />
                  </span>
                  <span>{calculateScore(item)}</span>
                  <span
                    onClick={() => handleVote(item.id, false)}
                    style={{
                      cursor: 'pointer',
                      color: voteStatus.voteType === 'no' ? '#ff4d4f' :  // red for no
                        voteStatus.voteType === 'yes' ? '#1890ff' : // blue for yes
                          '#808080'                               // grey for novote
                    }}
                  >
                    <ArrowDownOutlined />
                  </span>
                  {admin && (
                    <Button
                      type="text"
                      icon={<DeleteOutline />}
                      onClick={() => handleDelete(item)}
                    >
                    </Button>
                  )}
                </Space>
              ]}
            >
              <List.Item.Meta
                title={item.content}
              />
            </List.Item>
          )
        }}
      />
    </>
  )
}
