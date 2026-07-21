// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {

    address public owner;

    // ============================
    // OWNER
    // ============================
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi Owner moi duoc goi ham nay");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Dia chi moi khong duoc la zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ============================
    // VOTER
    // ============================
    struct VoterInfo {
        uint256 id;
        string fullName;
        address wallet;
        bool verified;
        bool active;
        bool voted;
    }

    mapping(address => VoterInfo) public voters;
    address[] public voterList;

    event VoterRegistered(address indexed wallet, string fullName);
    event VoterVerified(address indexed wallet);
    event VoterDisabled(address indexed wallet);
    event VoterEnabled(address indexed wallet);

    modifier voterExists(address wallet) {
        require(voters[wallet].wallet != address(0), "Cu tri khong ton tai");
        _;
    }

    function registerVoter(string memory _fullName, address _wallet) public onlyOwner {
        require(_wallet != address(0), "Dia chi vi khong hop le");
        require(bytes(_fullName).length > 0, "Ten khong duoc de trong");
        require(voters[_wallet].wallet == address(0), "Vi nay da duoc dang ky");

        uint256 id = voterList.length;
        voters[_wallet] = VoterInfo(id, _fullName, _wallet, false, true, false);
        voterList.push(_wallet);

        emit VoterRegistered(_wallet, _fullName);
    }

    function verifyVoter(address _wallet) public onlyOwner voterExists(_wallet) {
        require(!voters[_wallet].verified, "Da xac thuc");
        voters[_wallet].verified = true;
        emit VoterVerified(_wallet);
    }

    function disableVoter(address _wallet) public onlyOwner voterExists(_wallet) {
        require(voters[_wallet].active, "Da bi khoa");
        voters[_wallet].active = false;
        emit VoterDisabled(_wallet);
    }

    function enableVoter(address _wallet) public onlyOwner voterExists(_wallet) {
        require(!voters[_wallet].active, "Dang hoat dong");
        voters[_wallet].active = true;
        emit VoterEnabled(_wallet);
    }

    function getVoter(address _wallet) public view voterExists(_wallet) returns (VoterInfo memory) {
        return voters[_wallet];
    }

    function getAllVoters() public view returns (address[] memory) {
        return voterList;
    }

    function totalVoters() public view returns (uint256) {
        return voterList.length;
    }

    function isVerified(address _wallet) public view returns (bool) {
        return voters[_wallet].verified;
    }

    function isActive(address _wallet) public view returns (bool) {
        return voters[_wallet].active;
    }

    function hasVoted(address _wallet) public view returns (bool) {
        return voters[_wallet].voted;
    }

    // ============================
    // ELECTION
    // ============================
    enum ElectionStatus { Pending, Registration, Verification, Voting, Ended }

    struct ElectionData {
        uint256 id;
        string title;
        string description;
        ElectionStatus status;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(uint256 => ElectionData) public elections;
    uint256 public electionCount;

    event ElectionCreated(uint256 indexed electionId, string title);
    event ElectionStatusChanged(uint256 indexed electionId, ElectionStatus status);

    modifier electionExists(uint256 id) {
        require(id < electionCount, "Election khong ton tai");
        _;
    }

    function createElection(string memory _title, string memory _description) public onlyOwner {
        require(bytes(_title).length > 0, "Title khong duoc de trong");

        uint256 id = electionCount++;
        elections[id] = ElectionData(id, _title, _description, ElectionStatus.Pending, 0, 0);

        emit ElectionCreated(id, _title);
    }

    function changeElectionStatus(uint256 _electionId, ElectionStatus _status) public onlyOwner electionExists(_electionId) {
        ElectionData storage e = elections[_electionId];

        // Kiểm tra thứ tự trạng thái (không cho nhảy lung tung)
        require(uint(_status) == uint(e.status) + 1 || uint(_status) == uint(e.status), "Sai thu tu giai doan");

        e.status = _status;

        if (_status == ElectionStatus.Voting) {
            e.startTime = block.timestamp;
        }
        if (_status == ElectionStatus.Ended) {
            e.endTime = block.timestamp;
        }

        emit ElectionStatusChanged(_electionId, _status);
    }

    function getElection(uint256 _electionId) public view electionExists(_electionId) returns (ElectionData memory) {
        return elections[_electionId];
    }

    function getAllElections() public view returns (ElectionData[] memory) {
        ElectionData[] memory all = new ElectionData[](electionCount);
        for (uint256 i = 0; i < electionCount; i++) {
            all[i] = elections[i];
        }
        return all;
    }

    // ============================
    // CANDIDATE
    // ============================
    struct CandidateData {
        uint256 id;
        string fullName;
        address wallet;
        string description;
        uint256 voteCount;
        bool verified;
    }

    mapping(uint256 => CandidateData) public candidates;
    mapping(address => bool) public candidateWallets;
    uint256 public candidateCount;

    event CandidateAdded(uint256 indexed candidateId, string fullName);
    event CandidateVerified(uint256 indexed candidateId);

    modifier candidateExists(uint256 id) {
        require(id < candidateCount, "Ung vien khong ton tai");
        _;
    }

    function addCandidate(string memory _fullName, address _wallet, string memory _description) public onlyOwner {
        require(bytes(_fullName).length > 0, "Ten ung vien khong duoc de trong");
        require(_wallet != address(0), "Dia chi vi khong hop le");
        require(!candidateWallets[_wallet], "Wallet da duoc su dung");

        uint256 id = candidateCount++;
        candidates[id] = CandidateData(id, _fullName, _wallet, _description, 0, false);
        candidateWallets[_wallet] = true;

        emit CandidateAdded(id, _fullName);
    }

    function verifyCandidate(uint256 _candidateId) public onlyOwner candidateExists(_candidateId) {
        require(!candidates[_candidateId].verified, "Da xac thuc");
        candidates[_candidateId].verified = true;
        emit CandidateVerified(_candidateId);
    }

    function increaseVote(uint256 _candidateId) internal candidateExists(_candidateId) {
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint256 _candidateId) public view candidateExists(_candidateId) returns (CandidateData memory) {
        return candidates[_candidateId];
    }

    function getAllCandidates() public view returns (CandidateData[] memory) {
        CandidateData[] memory all = new CandidateData[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            all[i] = candidates[i];
        }
        return all;
    }

    // ============================
    // VOTING
    // ============================
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address voter);

    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(_electionId < electionCount, "Election khong ton tai");
        require(_candidateId < candidateCount, "Ung vien khong ton tai");
        require(voters[msg.sender].verified, "Chua duoc xac thuc");
        require(voters[msg.sender].active, "Cu tri bi khoa");
        require(!voters[msg.sender].voted, "Da bo phieu roi");
        require(elections[_electionId].status == ElectionStatus.Voting, "Khong phai giai doan bo phieu");
        require(candidates[_candidateId].verified, "Ung vien chua duoc xac thuc");

        increaseVote(_candidateId);
        voters[msg.sender].voted = true;

        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    // ============================
    // RESULT
    // ============================
    function getWinner() public view returns (uint256 winnerId, uint256 maxVotes) {
        maxVotes = 0;
        for (uint256 i = 0; i < candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
    }

    function totalVotes() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < candidateCount; i++) {
            total += candidates[i].voteCount;
        }
        return total;
    }
}