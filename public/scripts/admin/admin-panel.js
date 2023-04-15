const addUser = async (info) => {
  const response = await fetch('/api/v1/users/one', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...info }),
  });
  console.log({ ...info });
  const resBody = await response.json();

  return resBody;
};

const updateUser = async (usernameKey, updateObj) => {
  const response = await fetch('/api/v1/users/one', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usernameKey, info: updateObj }),
  });
  const resBody = await response.json();

  return resBody;
};

const fetchUsers = async () => {
  const usersResponse = await fetch('/api/v1/users');
  const users = await usersResponse.json();
  return users.users;
};

const fetchUsersSearch = async (query) => {
  const usersResponse = await fetch(
    `/api/v1/users/search?query=${encodeURIComponent(query)}`,
  );
  const users = await usersResponse.json();
  return users.users;
};

const createRow = (userNo, username, displayName, email, id) => {
  const numberCell = document.createElement('th');
  const usernameCell = document.createElement('td');
  const displayNameCell = document.createElement('td');
  const emailCell = document.createElement('td');
  const idCell = document.createElement('td');

  numberCell.scope = 'row';
  usernameCell.classList.add('username');
  displayNameCell.classList.add('display-name');
  emailCell.classList.add('email');
  idCell.classList.add('id');

  idCell.style.display = 'none';

  numberCell.innerText = userNo;
  usernameCell.innerText = username;
  displayNameCell.innerText = displayName;
  emailCell.innerText = email;
  idCell.innerText = id;

  const row = document.createElement('tr');
  row.appendChild(numberCell);
  row.appendChild(usernameCell);
  row.appendChild(displayNameCell);
  row.appendChild(emailCell);
  row.appendChild(idCell);

  return row;
};

const addTableData = (users) => {
  const tableBody = document.getElementById('user-data-table-body');
  const contextMenu = document.getElementById('context-menu');

  for (let i = 0, n = users.length; i < n; i += 1) {
    tableBody.appendChild(
      createRow(
        i + 1,
        users[i].username,
        users[i].displayName,
        users[i].email,
        users[i].id,
      ),
    );
  }

  // Context-menu
  Array.from(tableBody.getElementsByTagName('tr')).forEach((row) => {
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      const username = e.currentTarget.getElementsByClassName('username')?.[0]?.innerText;
      const displayName = e.currentTarget.getElementsByClassName('display-name')?.[0]?.innerText;
      const email = e.currentTarget.getElementsByClassName('email')?.[0]?.innerText;
      const id = e.currentTarget.getElementsByClassName('id')?.[0]?.innerText;

      document.getElementById('context-username').innerText = username;
      document.getElementById('context-display-name').innerText = displayName;
      document.getElementById('context-email').innerText = email;
      document.getElementById('context-id').innerText = id;

      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
      contextMenu.style.display = 'block';
    });
  });
};

const loadTableData = async (usersFetchFunction) => {
  const table = document.getElementById('user-data-table');
  const tableSpinner = document.getElementById('user-data-table-spinner');

  const users = await usersFetchFunction();
  addTableData(users);
  tableSpinner.style.display = 'none';
  table.style.display = '';
};

const reloadTableData = async (usersFetchFunction) => {
  const table = document.getElementById('user-data-table');
  const tableBody = document.getElementById('user-data-table-body');
  const tableSpinner = document.getElementById('user-data-table-spinner');

  tableSpinner.style.display = '';
  table.style.display = 'none';
  tableBody.innerHTML = '';

  const users = await usersFetchFunction();
  addTableData(users);

  tableSpinner.style.display = 'none';
  table.style.display = '';
};

document.addEventListener('DOMContentLoaded', () => {
  const contextMenu = document.getElementById('context-menu');

  const usernameMenuItem = document.getElementById('context-username');
  const displayNameMenuItem = document.getElementById('context-display-name');
  const emailMenuItem = document.getElementById('context-email');
  // const idMenuItem = document.getElementById('context-id');

  const usernameKeyEditInput = document.getElementById('username-key-edit-inp');
  const usernameEditInput = document.getElementById('username-edit-inp');
  const displayNameEditInput = document.getElementById('display-name-edit-inp');
  const emailEditInput = document.getElementById('email-edit-inp');
  const passwordEditInput = document.getElementById('password-edit-inp');

  const usernameCheckbox = document.getElementById('username-checkbox');
  const displayNameCheckbox = document.getElementById('display-name-checkbox');
  const emailCheckbox = document.getElementById('email-checkbox');
  const passwordCheckbox = document.getElementById('password-checkbox');

  const usernameAddInput = document.getElementById('username-add-inp');
  const displayNameAddInput = document.getElementById('display-name-add-inp');
  const emailAddInput = document.getElementById('email-add-inp');
  const passwordAddInput = document.getElementById('password-add-inp');

  const searchForm = document.getElementById('search-form');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = new FormData(searchForm).get('search');
    reloadTableData(async () => fetchUsersSearch(query));
  });

  // Delete Modal
  // eslint-disable-next-line no-undef
  const statusModal = new bootstrap.Modal(
    document.getElementById('statusModal'),
    {
      backdrop: true,
      focus: true,
      keyboard: true,
    },
  );
  const statusModalHead = document
    .getElementById('statusModal')
    .getElementsByClassName('modal-title')[0];
  const statusModalBody = document
    .getElementById('statusModal')
    .getElementsByClassName('modal-body')[0];

  // setTimeout(() => loadTableData(async () => fetchUsers()), 2000);

  loadTableData(async () => fetchUsers());

  // Edit Modal
  // eslint-disable-next-line no-undef
  const editModal = new bootstrap.Modal(document.getElementById('editModal'), {
    backdrop: true,
    focus: true,
    keyboard: true,
  });

  // Add Modal
  // eslint-disable-next-line no-undef
  const addModal = new bootstrap.Modal(document.getElementById('addModal'), {
    backdrop: true,
    focus: true,
    keyboard: true,
  });

  document
    .getElementById('modal-save-btn')
    .addEventListener('click', async () => {
      const updateObj = {};

      if (usernameCheckbox.checked) {
        updateObj.username = usernameEditInput.value;
      }

      if (displayNameCheckbox.checked) {
        updateObj.displayName = displayNameEditInput.value;
      }

      if (emailCheckbox.checked) {
        updateObj.email = emailEditInput.value;
      }

      if (passwordCheckbox.checked) {
        updateObj.password = passwordEditInput.value;
      }

      const resBody = await updateUser(usernameKeyEditInput.value, updateObj);

      if (resBody.isSuccess) {
        statusModalHead.innerText = 'Successfully Updated';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
        reloadTableData(async () => fetchUsers());
      } else {
        statusModalHead.innerText = 'Error';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
      }

      console.log('usernameKey:', usernameKeyEditInput.value);
      console.log(updateObj);
      editModal.hide();
    });

  document.getElementById('add-button').addEventListener('click', () => {
    addModal.show();
  });

  document
    .getElementById('add-modal-save-btn')
    .addEventListener('click', async () => {
      const info = {};
      info.username = usernameAddInput.value;
      info.displayName = displayNameAddInput.value;
      info.email = emailAddInput.value;
      info.password = passwordAddInput.value;
      console.log({ ...info });

      const resBody = await addUser(info);

      if (resBody.isSuccess) {
        statusModalHead.innerText = 'Successful';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
        reloadTableData(async () => fetchUsers());
      } else {
        statusModalHead.innerText = 'Error';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
      }

      console.log(info);
      addModal.hide();
    });

  document.addEventListener('click', (e) => {
    if (e.target.offsetParent !== contextMenu) {
      contextMenu.style.display = 'none';
    }
  });

  document.getElementById('context-edit').addEventListener('click', () => {
    const username = usernameMenuItem.innerText;
    const displayName = displayNameMenuItem.innerText;
    const email = emailMenuItem.innerText;

    usernameKeyEditInput.value = username;
    usernameEditInput.value = username;
    displayNameEditInput.value = displayName;
    emailEditInput.value = email;
    passwordEditInput.value = '';

    editModal.show();
  });

  document
    .getElementById('context-delete')
    .addEventListener('click', async () => {
      const username = usernameMenuItem.innerText;

      const response = await fetch('/api/v1/users/one', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const resBody = await response.json();

      if (resBody.isSuccess) {
        statusModalHead.innerText = 'Successfully Removed';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
        reloadTableData(async () => fetchUsers());
      } else {
        statusModalHead.innerText = 'Error';
        statusModalBody.innerText = resBody.message;
        statusModal.show();
      }
    });
});
