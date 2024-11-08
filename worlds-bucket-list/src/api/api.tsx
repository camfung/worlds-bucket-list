// api.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export interface BucketListItem {
	id: number;
	content: string;
	upvotes: number;
	downvotes: number;
}

export const bucketListApi = {
	vote: async (id: number, isUpvote: boolean) => {
		try {
			const response = await axios.put(`${BASE_URL}/bucket-list/${id}/vote`, {
				isUpvote,
			});
			return response.data;
		} catch (error) {
			console.error('Error voting:', error);
			throw error;
		}
	},

	delete: async (id: number): Promise<void> => {
		try {
			const response = await fetch(`${BASE_URL}/bucket-list/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to delete item');
			}
		} catch (error) {
			console.error('Error deleting item:', error);
			throw error;
		}
	},

	create: async (content: string) => {
		try {
			const response = await fetch(`${BASE_URL}/bucket-list`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content }),
			});

			if (!response.ok) {
				throw new Error('Failed to submit bucket list item');
			}

			return await response.json();
		} catch (error) {
			console.error('Error submitting bucket list item:', error);
			throw error;
		}
	},

	get: async () => {
		try {
			const response = await fetch(`${BASE_URL}/bucket-list`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data)
			return data;

		} catch (error) {
			console.error("error fetching bucket list items", error);
			throw error;
		}
	}
};

export type VoteType = 'yes' | 'no' | 'novote';

export const voteStorage = {
	getVotedItems: () => {
		return JSON.parse(localStorage.getItem('votedItems') || '{}');
	},

	setVotedItem: (id: number, vote: VoteType) => {
		const votedItems = voteStorage.getVotedItems();
		localStorage.setItem('votedItems', JSON.stringify({
			...votedItems,
			[id]: vote
		}));
	},

	hasVoted: (id: number): { voted: boolean; voteType: VoteType } => {
		const votedItems = voteStorage.getVotedItems();
		return {
			voted: !!votedItems[id],
			voteType: votedItems[id] || 'novote'
		};
	}
};
// Helper functions
export const calculateScore = (item: BucketListItem): number => {
	return item.upvotes - item.downvotes;
};
