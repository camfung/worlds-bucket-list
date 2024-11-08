// App.tsx
import './App.css'
import { useEffect, useState } from 'react'
import TypingAnimation from './TypingAnimation'
import InputForm from './InputForm'
import { Space, Card, message } from 'antd'
import { bucketListApi, BucketListItem } from './api/api'
import { BucketList } from './BucketList'

const welcomeMessage = "Welcome to the World's Bucket List ✨\nShare your ultimate dream with the world."

function App() {

  const [items, setItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit = async (value: string) => {

    try {
      setLoading(true);
      await bucketListApi.create(value)
      const items = await bucketListApi.get()
      setItems(items)

      message.success('Bucket list item submitted successfully!');
      setLoading(false);

    } catch (error) {
      console.error('Error submitting bucket list item:', error);
      message.error('Failed to submit bucket list item');
    }
  };

  const get = async () => {
    const items = await bucketListApi.get()
    items.sort((a: BucketListItem, b: BucketListItem) => (Math.abs(b.upvotes - b.downvotes)) - (Math.abs(a.upvotes - a.downvotes)));
    setItems(items)
  }
  useEffect(() => {
    get()
  }, [])

  return (
    <Card className="main-card" >
      <Space direction="vertical" size="large" >
        <TypingAnimation text={welcomeMessage} />
        <InputForm onSubmit={onSubmit} />
        <BucketList fetchItems={get} setItems={setItems} loading={loading} items={items} />

      </Space>
    </Card>
  )
}

export default App
