import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Sorter from "../modules/Sorter";
import MemberPicture from "./MemberPicture";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

import hpDB from "../modules/HPDatabase";

interface Props {
  members: string[];
  sortName: string;
}
interface State {
  result: boolean;
}

export default class SortPage extends React.Component<Props, State> {
  sort: Sorter;
  constructor(props: Props) {
    super(props);
    this.sort = new Sorter(props.members);
    this.state = { result: this.sort.sort() };
  }
  render() {
    if (this.state.result) {
      let list: JSX.Element[] = [];
      let tweet_url: string = "https://twitter.com/intent/tweet?text=" + encodeURI(`${this.props.sortName}結果\n`);
      for (let i of this.sort.array) {
        let groupname = hpDB.groupNameByMemberName(i);
        list.push(<TableRow key={i}><TableCell align="left">{this.sort.rank(i)}位</TableCell><TableCell align="left">{i}</TableCell><TableCell><span style={{ color: hpDB.groupName2ColorCode(hpDB.groupNameByMemberName(i)) }}><FontAwesomeIcon icon={faUserFriends} /></span> {groupname}</TableCell></TableRow>);
        if (this.sort.rank(i) <= 10) {
          tweet_url += encodeURI(`${this.sort.rank(i)}位: ${i}\n`);
        }
      }
      tweet_url += "&hashtags=" + encodeURI("ハロプロソート") + "&url=" + encodeURI("https://16be.at/sort/");
      console.log(tweet_url);
      return <Grid container spacing={1}>
        <Grid container item xs={12} justify="center">
          <h3>{this.props.sortName}結果</h3>
        </Grid>
        <Grid container item xs={12} justify="center" spacing={0}>
          【ラウンド{this.sort.currentRound} - {this.sort.progress}%】
            </Grid>
        <Grid container item xs={12} justify="center">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow style={{ backgroundColor: "#444" }}>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>順位</TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>名前</TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>所属グループ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container item xs={12} justify="center">
          <p>
          <Button href={tweet_url} target="_blank" variant="contained" size="large" style={{ backgroundColor: "#00ACEE", color: "#ffffff" }}><FontAwesomeIcon icon={faTwitter} />&nbsp;ツイート</Button>
          </p>
        </Grid>
      </Grid>
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Grid container spacing={1}>
            <Grid container item xs={12} justify="center">
              <h3 style={{}}>{this.props.sortName}</h3>
            </Grid>
            <Grid container item xs={12} justify="center" spacing={0}>
              【ラウンド{this.sort.currentRound} - {this.sort.progress}%】
            </Grid>
            <Grid container item xs={6} justify="center">
              <MemberPicture name={this.sort.lastChallenge[0]}
                onClick={() => {
                  this.sort.addResult(this.sort.lastChallenge[0], this.sort.lastChallenge[1]);
                  this.setState({ result: this.sort.sort() });
                }} />
            </Grid>
            <Grid container item xs={6} justify="center">
              <MemberPicture name={this.sort.lastChallenge[1]}
                onClick={() => {
                  this.sort.addResult(this.sort.lastChallenge[1], this.sort.lastChallenge[0]);
                  this.setState({ result: this.sort.sort() });
                }} />
            </Grid>
            <Grid container item xs={12} justify="center">
              <Button variant="contained" size="large" style={{ backgroundColor: "white", color: "#444" }}
                onClick={() => {
                  this.sort.addEqual(this.sort.lastChallenge[0], this.sort.lastChallenge[1]);
                  this.setState({ result: this.sort.sort() });
                }}
              >
                引き分け
            </Button>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}