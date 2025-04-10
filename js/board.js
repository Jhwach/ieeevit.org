const adjustBoardSection = () => {
  const board_members = document.querySelector(".board-members");
  let count = parseInt(document.querySelector("#board").clientWidth / 185);

  if (board_members.childElementCount % count !== 0) {
    count =
      board_members.childElementCount % (count - 1) === 0 ? count - 1 : count;
  }
  count = parseInt(Math.max(1, count));
  if(count>5)
  {
    count=5;
  }
  board_members.style.gridTemplateColumns = `repeat(${count}, 185px)`;
};

window.onresize = () => {
  adjustBoardSection();
};

const makeBoardCard = ({ name, pos, img }) => {
  const img_el = document.createElement("img");
  img_el.src = `./images/board-images/${img}.jpg`;
  img_el.alt = name;

  const position = document.createElement("div");
  position.classList.add("position");
  position.innerText = pos;

  const name_el = document.createElement("div");
  name_el.classList.add("name");
  name_el.innerText = name;

  const content = document.createElement("div");
  content.classList.add("content");
  content.appendChild(position);
  content.appendChild(name_el);

  const board_member = document.createElement("div");
  board_member.classList.add("board-member");
  board_member.appendChild(img_el);
  board_member.appendChild(content);

  return board_member;
};

const fillBoard = (board_members) => {
  const container = document.querySelector(".board-members");

  board_members.forEach((board_member) => {
    container.appendChild(makeBoardCard(board_member));
  });
};

const addBoard = async (filePath, year = null) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    
    // Clear existing board members
    const container = document.querySelector(".board-members");
    container.innerHTML = '';
    
    if (window.location.pathname.includes("alumni.html")) {
      // For alumni page, use the selected year
      if (year && data[year]) {
        fillBoard(data[year].board);
      } else {
        // Default to the most recent year if no year specified
        const mostRecentYear = Object.keys(data).sort().reverse()[0];
        fillBoard(data[mostRecentYear].board);
      }
    } else {
      // For home page, always show current year (2023-24)
      fillBoard(data["2023-24"].board);
    }
    
    adjustBoardSection();
  } catch (error) {
    console.error('Error loading board data:', error);
  }
};

// Update the path handling logic
if (window.location.pathname.includes("alumni.html")) {
  addBoard("./alumni_board/board.json");
} else {
  // For home page, use the same board.json but only display current year
  addBoard("./alumni_board/board.json");
}

// Update the dropdown change handler
if (window.location.pathname.includes("alumni.html")) {
  document.getElementById("dropdown-container").addEventListener("change", function() {
    const selectedValue = this.value;
    const gridNumber = selectedValue.replace('image-grid', '');
    
    // Map the image-grid values to academic years
    const yearMap = {
      '5': '2023-24',
      '4': '2022-23',
      '3': '2021-22',
      '2': '2020-21'
    };
    
    addBoard("./alumni_board/board.json", yearMap[gridNumber]);
  });
}
