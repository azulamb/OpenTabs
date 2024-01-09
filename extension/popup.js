window.addEventListener('DOMContentLoaded', () => {
	function GetWindowId() {
		return new Promise((resolve) => {
			chrome.windows.getCurrent((window) => {
				resolve(window.id);
			});
		});
	}

	const getUrls = ((textarea) => {
		return () => {
			return textarea.value.split('\n').filter((url) => {
				return url.match(/^https?:\/\//);
			});
		};
	})(document.getElementById('list'));

	document.getElementById('open').addEventListener('click', () => {
		GetWindowId().then(async (windowId) => {
			const urls = getUrls();
			for (const url of urls) {
				await chrome.tabs.create({
					url: url,
					windowId: windowId,
				});
			}
			document.getElementById('count').textContent = `${urls}`;
		});
	});
});
