window.addEventListener('DOMContentLoaded', () => {
	function GetWindowId() {
		return new Promise((resolve) => {
			chrome.windows.getCurrent((window) => {
				resolve(window.id);
			});
		});
	}

	const [getUrls, updateUrls] = ((textarea) => {
		return [
			() => {
				return textarea.value.split('\n').filter((url) => {
					return url.match(/^https?:\/\//);
				});
			},
			(urls) => {
				textarea.value = urls.join('\n');
			},
		];
	})(document.getElementById('list'));

	document.getElementById('open').addEventListener('click', () => {
		GetWindowId().then(async (windowId) => {
			const urls = getUrls();
			const errors = [];
			for (const url of urls) {
				try{
					await chrome.tabs.create({
						url: url,
						active: false,
						windowId: windowId,
					});
				} catch(_e) {
					errors.push(url);
				}
			}
			updateUrls(errors);
			document.getElementById('count').textContent = `${urls.length}`;
		});
	});
});
