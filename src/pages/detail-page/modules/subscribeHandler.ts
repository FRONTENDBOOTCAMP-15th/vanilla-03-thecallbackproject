import {
  addSubscribe,
  removeSubscribe,
  getMySubscriptions,
} from '../../../apis/subscribeAPIs';
import { getAuthorizationHeader } from '../../../utils/axios';

type SubscriptionItem = {
  _id: number;
  user?: { _id: number };
};

let isSubscribed = false;
let currentSubscriptionId: number | null = null;

export async function setupSubscribeButton(authorId: number) {
  const btn = document.querySelector('.subscribe-btn') as HTMLButtonElement;
  if (!btn) return;

  const subscriberCountEl = document.querySelector(
    '.subscriber-count',
  ) as HTMLElement;

  const authHeader = getAuthorizationHeader();
  const item = localStorage.getItem('item');
  const loginUserId = item ? Number(JSON.parse(item)._id) : null;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    btn.disabled = true;
    btn.classList.add('disabled-subscribe');
    btn.textContent = '+ 구독';
    return;
  }

  if (loginUserId === authorId) {
    btn.disabled = true;
    btn.textContent = '+ 구독';
    btn.classList.add('disabled-subscribe');
    return;
  }

  const subscriptions = (await getMySubscriptions()) as SubscriptionItem[];
  const found = subscriptions.find(s => Number(s.user?._id) === authorId);

  if (found) {
    isSubscribed = true;
    currentSubscriptionId = found._id;
  } else {
    isSubscribed = false;
    currentSubscriptionId = null;
  }

  updateSubscribeButtonUI(btn);

  btn.addEventListener('click', async () => {
    try {
      if (isSubscribed) {
        await removeSubscribe(currentSubscriptionId!);

        isSubscribed = false;
        currentSubscriptionId = null;

        subscriberCountEl.textContent = String(
          Math.max(0, Number(subscriberCountEl.textContent) - 1),
        );
      } else {
        await addSubscribe(authorId);

        const refreshed = (await getMySubscriptions()) as SubscriptionItem[];
        const newItem = refreshed.find(s => Number(s.user?._id) === authorId);

        isSubscribed = true;
        currentSubscriptionId = newItem ? Number(newItem._id) : null;

        subscriberCountEl.textContent = String(
          Number(subscriberCountEl.textContent) + 1,
        );
      }

      updateSubscribeButtonUI(btn);
    } catch {
      alert('구독 처리 중 오류 발생');
    }
  });
}

function updateSubscribeButtonUI(btn: HTMLButtonElement) {
  if (isSubscribed) {
    btn.classList.add('on');
    btn.textContent = '✔ 구독중';
  } else {
    btn.classList.remove('on');
    btn.textContent = '+ 구독';
  }
}
